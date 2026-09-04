import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

import ResumeEditor from "../../components/resumeBuilder/editor/ResumeEditor";
import BrandMark from "../../components/portfolio/BrandMark";
import {
  PRIVATE_ROBOTS_DIRECTIVE,
  SITE_NAME,
} from "../../components/portfolio/siteMetadata";
import {
  createDefaultCustomization,
  normalizeCVData,
  resolveDensity,
} from "../../components/resumeBuilder/resumeLayout";
import {
  createResumeHistorySnapshot,
  isResumePreviewCurrent,
  ResumeHistorySnapshot,
  ResumeTemplateFilter,
  resumeValuesEqual,
} from "../../components/resumeBuilder/resumeHistory";
import {
  loadResumeDraft,
  parseResumeDraft,
  RESUME_STORAGE_KEY,
  saveResumeDraft,
  serializeResumeDraft,
} from "../../components/resumeBuilder/resumeStorage";
import {
  CLASSIC_RESUME_TEMPLATE_COUNT,
  DEFAULT_RESUME_TEMPLATE_ID,
  EXPRESSIVE_RESUME_TEMPLATE_COUNT,
  getResumeFileName,
  getResumeTemplate,
  resumeTemplates,
} from "../../components/resumeBuilder/templates/catalog";
import {
  CVData,
  ResumeCustomization,
} from "../../components/resumeBuilder/types";
import { portfolioConfig, resumeData } from "../../content/runtime";

import styles from "./index.module.scss";

type WorkspaceView = "edit" | "preview";
const initialData = normalizeCVData(resumeData);
const initialCustomization = createDefaultCustomization();
const defaultJson = JSON.stringify(initialData, null, 2);
const HISTORY_LIMIT = 60;
const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

const ResumePdfProvider = dynamic(
  () =>
    import("../../components/resumeBuilder/ResumePdfRenderer").then(
      (module) => module.ResumePdfProvider,
    ),
  { ssr: false },
);

type PdfRenderState = {
  error: string | null;
  loading: boolean;
  url: string | null;
};

const ResumeBuilder = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [data, setData] = useState<CVData>(initialData);
  const [customization, setCustomization] =
    useState<ResumeCustomization>(initialCustomization);
  const [previewData, setPreviewData] = useState<CVData>(initialData);
  const [previewCustomization, setPreviewCustomization] =
    useState<ResumeCustomization>(initialCustomization);
  const [previewTemplateId, setPreviewTemplateId] = useState(
    DEFAULT_RESUME_TEMPLATE_ID,
  );
  const [previewRevision, setPreviewRevision] = useState(0);
  const [jsonString, setJsonString] = useState(defaultJson);
  const [notice, setNotice] = useState("Your draft stays on this device.");
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    DEFAULT_RESUME_TEMPLATE_ID,
  );
  const [templateFilter, setTemplateFilter] =
    useState<ResumeTemplateFilter>("classic");
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("edit");
  const [pdfRendererReady, setPdfRendererReady] = useState(false);
  const undoStackRef = useRef<ResumeHistorySnapshot[]>([]);
  const redoStackRef = useRef<ResumeHistorySnapshot[]>([]);
  const previewSwitchRef = useRef<HTMLButtonElement>(null);
  const previewSectionRef = useRef<HTMLElement>(null);
  const [, setHistoryRevision] = useState(0);

  useEffect(() => {
    const savedDraft = loadResumeDraft();
    if (savedDraft) {
      setData(savedDraft.data);
      setCustomization(savedDraft.customization);
      setPreviewData(savedDraft.data);
      setPreviewCustomization(savedDraft.customization);
      setJsonString(JSON.stringify(savedDraft.data, null, 2));
      if (savedDraft.templateId) {
        const savedTemplate = getResumeTemplate(savedDraft.templateId);
        setSelectedTemplateId(savedTemplate.id);
        setPreviewTemplateId(savedTemplate.id);
        setTemplateFilter(savedTemplate.family);
      }
      setNotice("Restored your local draft.");
    }
    setDraftReady(true);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    const queryValue = Array.isArray(router.query.template)
      ? router.query.template[0]
      : router.query.template;
    if (queryValue) {
      const queryTemplate = getResumeTemplate(queryValue);
      setSelectedTemplateId(queryTemplate.id);
      setTemplateFilter(queryTemplate.family);
    }
  }, [router.isReady, router.query.template]);

  useEffect(() => {
    if (
      isResumePreviewCurrent(
        data,
        previewData,
        customization,
        previewCustomization,
        selectedTemplateId,
        previewTemplateId,
      )
    ) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setPreviewData(data);
      setPreviewCustomization(customization);
      setPreviewTemplateId(selectedTemplateId);
      setPreviewRevision((revision) => revision + 1);
    }, 260);
    return () => window.clearTimeout(timer);
  }, [
    customization,
    data,
    previewCustomization,
    previewData,
    previewTemplateId,
    selectedTemplateId,
  ]);

  useEffect(() => {
    if (!draftReady) return undefined;
    const timer = window.setTimeout(() => {
      const saved = saveResumeDraft({
        customization,
        data,
        templateId: selectedTemplateId,
      });
      setNotice(
        saved
          ? "Saved locally."
          : "Local save unavailable. Export JSON to keep your changes.",
      );
    }, 500);
    return () => window.clearTimeout(timer);
  }, [customization, data, draftReady, selectedTemplateId]);

  useEffect(() => {
    if (pdfRendererReady) return undefined;

    if (workspaceView === "preview") {
      setPdfRendererReady(true);
      return undefined;
    }

    const target = previewSectionRef.current;
    if (!target || !("IntersectionObserver" in window)) {
      setPdfRendererReady(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setPdfRendererReady(true);
        observer.disconnect();
      },
      { rootMargin: "240px 0px", threshold: 0.01 },
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [pdfRendererReady, workspaceView]);

  const parsedJson = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonString) as unknown;
      return {
        data: parseResumeDraft(parsed).data,
        error: null as string | null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  }, [jsonString]);

  const selectedTemplate = getResumeTemplate(selectedTemplateId);
  const selectedResumeFileName = getResumeFileName(
    selectedTemplate,
    data.personalInfo?.name,
  );
  const density = resolveDensity(previewData, previewCustomization);
  const previewIsCurrent = isResumePreviewCurrent(
    data,
    previewData,
    customization,
    previewCustomization,
    selectedTemplateId,
    previewTemplateId,
  );
  const filteredTemplates = resumeTemplates.filter(
    (template) =>
      templateFilter === "all" || template.family === templateFilter,
  );
  const visibleSections = customization.sections.filter(
    (section) => section.visible,
  ).length;
  const roleCount =
    data.experience?.reduce(
      (total, company) => total + (company.roles?.length || 0),
      0,
    ) || 0;

  const refreshHistoryControls = () => {
    setHistoryRevision((revision) => revision + 1);
  };

  const rememberCurrentDraft = (includeTemplate = false) => {
    undoStackRef.current = [
      ...undoStackRef.current.slice(-(HISTORY_LIMIT - 1)),
      createResumeHistorySnapshot(
        data,
        customization,
        includeTemplate ? selectedTemplateId : undefined,
        includeTemplate ? templateFilter : undefined,
      ),
    ];
    redoStackRef.current = [];
    refreshHistoryControls();
  };

  const restoreSnapshot = (
    snapshot: ResumeHistorySnapshot,
    message: string,
  ) => {
    setData(snapshot.data);
    setCustomization(snapshot.customization);
    setJsonString(JSON.stringify(snapshot.data, null, 2));
    if (snapshot.templateId) {
      selectTemplate(snapshot.templateId, snapshot.templateFilter, true);
    }
    setNotice(message);
    refreshHistoryControls();
  };

  const undoEditorChange = () => {
    const previous = undoStackRef.current.pop();
    if (!previous) return;
    redoStackRef.current = [
      ...redoStackRef.current.slice(-(HISTORY_LIMIT - 1)),
      createResumeHistorySnapshot(
        data,
        customization,
        previous.templateId ? selectedTemplateId : undefined,
        previous.templateId ? templateFilter : undefined,
      ),
    ];
    restoreSnapshot(previous, "Undid the last editor change.");
  };

  const redoEditorChange = () => {
    const next = redoStackRef.current.pop();
    if (!next) return;
    undoStackRef.current = [
      ...undoStackRef.current.slice(-(HISTORY_LIMIT - 1)),
      createResumeHistorySnapshot(
        data,
        customization,
        next.templateId ? selectedTemplateId : undefined,
        next.templateId ? templateFilter : undefined,
      ),
    ];
    restoreSnapshot(next, "Redid the editor change.");
  };

  const canUndo = undoStackRef.current.length > 0;
  const canRedo = redoStackRef.current.length > 0;

  const showPdfPreview = () => {
    setWorkspaceView("preview");
    window.requestAnimationFrame(() => previewSwitchRef.current?.focus());
  };

  const selectTemplate = (
    templateId: string,
    nextFilter?: ResumeTemplateFilter,
    preserveRedo = false,
  ) => {
    const template = getResumeTemplate(templateId);
    if (
      !preserveRedo &&
      template.id !== selectedTemplateId &&
      redoStackRef.current.length
    ) {
      redoStackRef.current = [];
      refreshHistoryControls();
    }
    setSelectedTemplateId(template.id);
    if (nextFilter) setTemplateFilter(nextFilter);
    const nextQuery = { ...router.query };
    if (template.id === DEFAULT_RESUME_TEMPLATE_ID) {
      delete nextQuery.template;
    } else {
      nextQuery.template = template.id;
    }
    void router.replace(
      { pathname: router.pathname, query: nextQuery },
      undefined,
      { shallow: true, scroll: false },
    );
  };

  const updateData = (nextData: CVData) => {
    const normalized = normalizeCVData(nextData);
    if (resumeValuesEqual(data, normalized)) return;
    rememberCurrentDraft();
    setData(normalized);
    setJsonString(JSON.stringify(normalized, null, 2));
    setNotice("Editing…");
  };

  const updateCustomization = (next: ResumeCustomization) => {
    if (resumeValuesEqual(customization, next)) return;
    rememberCurrentDraft();
    setCustomization(next);
    setNotice("Editing…");
  };

  const applyJson = () => {
    if (!parsedJson.data) return;
    updateData(parsedJson.data);
    setJsonString(JSON.stringify(parsedJson.data, null, 2));
    setNotice("Advanced JSON applied.");
  };

  const resetStudio = () => {
    undoStackRef.current = [];
    redoStackRef.current = [];
    refreshHistoryControls();
    const nextCustomization = createDefaultCustomization();
    setData(initialData);
    setCustomization(nextCustomization);
    setPreviewData(initialData);
    setPreviewCustomization(nextCustomization);
    setPreviewTemplateId(DEFAULT_RESUME_TEMPLATE_ID);
    setPreviewRevision((revision) => revision + 1);
    setJsonString(defaultJson);
    setTemplateFilter("classic");
    selectTemplate(DEFAULT_RESUME_TEMPLATE_ID);
    try {
      window.localStorage.removeItem(RESUME_STORAGE_KEY);
    } catch (_error) {
      // The in-memory reset still succeeds when browser storage is unavailable.
    }
    setNotice("Reset to the portfolio source.");
  };

  const exportStudio = () => {
    const blob = new Blob(
      [
        serializeResumeDraft({
          customization,
          data,
          templateId: selectedTemplateId,
        }),
      ],
      { type: "application/json" },
    );
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = portfolioConfig.resumeDownloads.studioExportFileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(url), 0);
    setNotice("Resume data exported.");
  };

  const importStudio = async (file: File) => {
    try {
      if (file.size > MAX_IMPORT_BYTES) {
        throw new Error(
          "That file is too large. Import resume JSON under 2 MB.",
        );
      }
      const source = (await file.text()).replace(/^\uFEFF/, "");
      const draft = parseResumeDraft(JSON.parse(source));
      rememberCurrentDraft(true);
      setData(draft.data);
      if (draft.source === "studio") {
        setCustomization(draft.customization);
      }
      setJsonString(JSON.stringify(draft.data, null, 2));
      if (draft.templateId) {
        const importedTemplate = getResumeTemplate(draft.templateId);
        selectTemplate(importedTemplate.id, importedTemplate.family);
      }
      setNotice(`Imported ${file.name}.`);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not import that file.",
      );
    }
  };

  const renderPdfWorkspace = (pdfState?: PdfRenderState) => {
    const pdfReady = Boolean(
      previewIsCurrent && pdfState?.url && !pdfState.loading && !pdfState.error,
    );

    return (
      <>
        <div className={styles.previewToolbar}>
          <div>
            <p className={styles.eyebrow}>LIVE PDF PREVIEW</p>
            <h2 id="preview-title">{selectedTemplate.name}</h2>
            <p>
              {previewCustomization.appearance.density === "auto"
                ? `${density.label} auto-density`
                : `${density.label} density`}{" "}
              · {Math.round(previewCustomization.appearance.lineSpacing * 100)}%
              lines · {visibleSections} sections · {roleCount} roles
            </p>
          </div>

          {pdfReady ? (
            <a
              className={styles.downloadButton}
              download={selectedResumeFileName}
              href={pdfState?.url ?? undefined}
            >
              Download PDF ↓
            </a>
          ) : (
            <span
              aria-disabled="true"
              className={styles.downloadButtonDisabled}
            >
              {pdfState?.error
                ? "PDF unavailable"
                : isMounted
                  ? "Updating PDF…"
                  : "Preparing PDF…"}
            </span>
          )}
        </div>

        {selectedTemplate.id === DEFAULT_RESUME_TEMPLATE_ID && (
          <div className={styles.legacyNote} role="note">
            <strong>The portfolio download stays untouched.</strong>
            <span>
              This private Original builder copy supports the same adaptive
              controls and natural multi-page flow as Classic.
            </span>
          </div>
        )}

        <div className={styles.viewerShell}>
          <div className={styles.viewerTopbar} aria-hidden="true">
            <span />
            <span />
            <span />
            <p>{selectedResumeFileName}</p>
          </div>
          {pdfReady ? (
            <iframe
              className={styles.pdfViewer}
              src={`${pdfState?.url ?? ""}#toolbar=0`}
              title={`${selectedTemplate.name} resume PDF preview`}
            />
          ) : (
            <div className={styles.viewerLoading}>
              <span />
              <p>
                {pdfState?.error
                  ? "PDF unavailable."
                  : "Building your preview…"}
              </p>
            </div>
          )}
        </div>
        <p className={styles.mobilePreviewNote}>
          The PDF preview is visual. Use the editor labels and Download PDF for
          the accessible content workflow.
        </p>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>{`Private Resume Studio | ${SITE_NAME}`}</title>
        <meta key="robots" name="robots" content={PRIVATE_ROBOTS_DIRECTIVE} />
        <meta
          key="googlebot"
          name="googlebot"
          content={PRIVATE_ROBOTS_DIRECTIVE}
        />
        <meta
          key="description"
          name="description"
          content="A private, fully customizable resume editor with live PDF previews and downloadable templates."
        />
        <meta key="theme-color" name="theme-color" content="#080a0e" />
      </Head>

      <div className={styles.studio}>
        <header className={styles.hero}>
          <nav className={styles.nav} aria-label="Resume studio navigation">
            <Link
              href="/"
              className={styles.backLink}
              passHref
              prefetch={false}
            >
              <span aria-hidden="true">←</span> Portfolio
            </Link>
            <span className={styles.wordmark}>
              <BrandMark decorative className={styles.studioLogo} />
              <span>Private resume studio</span>
            </span>
            <span className={styles.saveStatus} role="status">
              <i aria-hidden="true" /> {notice}
            </span>
          </nav>

          <div className={styles.heroCopy}>
            <div>
              <p className={styles.kicker}>BUILD IT ONCE / SHAPE IT YOUR WAY</p>
              <h1>
                One career.
                <span>Sixteen expressions.</span>
              </h1>
            </div>
            <div className={styles.heroIntro}>
              <p>
                Edit every line, reorder or hide sections, tune the design, and
                let spacing react to the amount of content. Nothing leaves your
                device.
              </p>
              <div className={styles.heroMeta}>
                <span>{resumeTemplates.length} templates</span>
                <span>{CLASSIC_RESUME_TEMPLATE_COUNT} original-style</span>
                <span>{EXPRESSIVE_RESUME_TEMPLATE_COUNT} expressive</span>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.catalog} aria-labelledby="templates-title">
            <div className={styles.catalogHeader}>
              <div>
                <p className={styles.eyebrow}>START WITH A FORMAT</p>
                <h2 id="templates-title">Template family</h2>
              </div>
              <div className={styles.filterTabs} aria-label="Filter templates">
                {(
                  ["classic", "expressive", "all"] as ResumeTemplateFilter[]
                ).map((filter) => (
                  <button
                    aria-pressed={templateFilter === filter}
                    key={filter}
                    onClick={() => setTemplateFilter(filter)}
                    type="button"
                  >
                    {filter === "classic"
                      ? "Original-style"
                      : filter === "expressive"
                        ? "Expressive"
                        : "All"}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.templateRail}>
              {filteredTemplates.map((template, index) => {
                const isSelected = template.id === selectedTemplate.id;
                return (
                  <button
                    aria-pressed={isSelected}
                    className={`${styles.templateCard} ${
                      isSelected ? styles.templateCardSelected : ""
                    }`}
                    key={template.id}
                    onClick={() => selectTemplate(template.id)}
                    type="button"
                  >
                    <span
                      className={styles.miniature}
                      style={{ backgroundColor: template.background }}
                      aria-hidden="true"
                    >
                      <span
                        className={styles.miniatureAccent}
                        style={{ backgroundColor: template.accent }}
                      />
                      <span className={styles.miniatureTitle} />
                      <span className={styles.miniatureColumns}>
                        <span />
                        <span />
                      </span>
                    </span>
                    <span className={styles.cardContent}>
                      <span className={styles.cardTopline}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <span>
                          {template.isDefault
                            ? "DEFAULT"
                            : template.family === "classic"
                              ? "CLASSIC"
                              : "ALT"}
                        </span>
                      </span>
                      <strong>{template.name}</strong>
                      <small>{template.layout}</small>
                      <p>{template.description}</p>
                    </span>
                    <span className={styles.selectMark} aria-hidden="true">
                      {isSelected ? "●" : "○"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className={styles.viewSwitch} aria-label="Resume workspace view">
            <button
              aria-pressed={workspaceView === "edit"}
              onClick={() => setWorkspaceView("edit")}
              type="button"
            >
              Edit resume
            </button>
            <button
              aria-pressed={workspaceView === "preview"}
              onClick={showPdfPreview}
              ref={previewSwitchRef}
              type="button"
            >
              Preview PDF
            </button>
          </div>

          <div className={styles.workspace}>
            <section
              className={`${styles.editorColumn} ${
                workspaceView === "edit" ? styles.mobilePanelActive : ""
              }`}
              aria-label="Resume editor"
            >
              <ResumeEditor
                canRedo={canRedo}
                canUndo={canUndo}
                customization={customization}
                data={data}
                jsonError={parsedJson.error}
                jsonString={jsonString}
                onApplyJson={applyJson}
                onClose={showPdfPreview}
                onCustomizationChange={updateCustomization}
                onDataChange={updateData}
                onExport={exportStudio}
                onImportFile={importStudio}
                onJsonChange={setJsonString}
                onRedo={redoEditorChange}
                onReset={resetStudio}
                onUndo={undoEditorChange}
              />
            </section>

            <section
              className={`${styles.previewSection} ${
                workspaceView === "preview" ? styles.mobilePanelActive : ""
              }`}
              aria-labelledby="preview-title"
              ref={previewSectionRef}
            >
              {isMounted && pdfRendererReady ? (
                <ResumePdfProvider
                  customization={previewCustomization}
                  data={previewData}
                  key={previewRevision}
                  templateId={previewTemplateId}
                >
                  {renderPdfWorkspace}
                </ResumePdfProvider>
              ) : (
                renderPdfWorkspace()
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default ResumeBuilder;
