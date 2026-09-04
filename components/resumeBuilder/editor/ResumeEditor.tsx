import React, { useEffect, useRef, useState } from "react";

import { createDefaultCustomization, moveItem } from "../resumeLayout";
import {
  CVData,
  ResumeAppearance,
  ResumeCustomization,
  ResumeSectionSetting,
} from "../types";

import styles from "./ResumeEditor.module.scss";

type ResumeEditorProps = {
  canRedo: boolean;
  canUndo: boolean;
  customization: ResumeCustomization;
  data: CVData;
  jsonError: string | null;
  jsonString: string;
  onApplyJson: () => void;
  onClose: () => void;
  onCustomizationChange: (customization: ResumeCustomization) => void;
  onDataChange: (data: CVData) => void;
  onExport: () => void;
  onImportFile: (file: File) => void;
  onJsonChange: (value: string) => void;
  onReset: () => void;
  onRedo: () => void;
  onUndo: () => void;
};

type TabId = "content" | "sections" | "design" | "advanced";
type PersonalInfo = NonNullable<CVData["personalInfo"]>;
type About = NonNullable<CVData["about"]>;
type Education = NonNullable<CVData["education"]>;
type OpenSource = NonNullable<CVData["openSource"]>;
type Experience = NonNullable<CVData["experience"]>;
type Company = Experience[number];
type Role = NonNullable<Company["roles"]>[number];
type Projects = NonNullable<CVData["projects"]>;
type Project = Projects[number];
type SkillListKey = "technicalExpertise" | "skills" | "methodology" | "tools";

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "content", label: "Content" },
  { id: "sections", label: "Sections" },
  { id: "design", label: "Design" },
  { id: "advanced", label: "Advanced" },
];

const defaultAppearance = createDefaultCustomization().appearance;

const layoutPresets: Array<{
  description: string;
  label: string;
  values: Pick<
    ResumeAppearance,
    "density" | "fontScale" | "lineSpacing" | "pageMargin" | "spacingScale"
  >;
}> = [
  {
    description: "Fit dense content",
    label: "Fit more",
    values: {
      density: "compact",
      fontScale: 0.9,
      lineSpacing: 0.9,
      pageMargin: 0.86,
      spacingScale: 0.82,
    },
  },
  {
    description: "Adaptive defaults",
    label: "Balanced",
    values: {
      density: "auto",
      fontScale: 1,
      lineSpacing: 1,
      pageMargin: 1,
      spacingScale: 1,
    },
  },
  {
    description: "More breathing room",
    label: "Airy",
    values: {
      density: "comfortable",
      fontScale: 1.04,
      lineSpacing: 1.08,
      pageMargin: 1.06,
      spacingScale: 1.12,
    },
  },
];

const personalFields: Array<{
  autoComplete?: string;
  key: keyof PersonalInfo;
  label: string;
  type?: "email" | "tel" | "text" | "url";
}> = [
  { autoComplete: "name", key: "name", label: "Full name" },
  { key: "title", label: "Professional title" },
  { autoComplete: "address-level1", key: "location", label: "Location" },
  { autoComplete: "tel", key: "phone", label: "Phone", type: "tel" },
  { autoComplete: "email", key: "email", label: "Email", type: "email" },
  { key: "linkedin", label: "LinkedIn URL", type: "url" },
  { key: "github", label: "GitHub URL", type: "url" },
  { key: "website", label: "Website URL", type: "url" },
];

const skillLists: Array<{ key: SkillListKey; label: string }> = [
  { key: "technicalExpertise", label: "Core expertise" },
  { key: "skills", label: "Skills / exposure" },
  { key: "methodology", label: "Methodology / approach" },
  { key: "tools", label: "Tools" },
];

const emptyCompany = (): Company => ({
  company: "",
  companyPeriod: "",
  roles: [],
});

const emptyRole = (): Role => ({
  period: "",
  position: "",
  responsibilities: [],
});

const emptyProject = (): Project => ({
  description: "",
  details: [],
  name: "",
});

type TextFieldProps = {
  autoComplete?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "email" | "tel" | "text" | "url";
  value: string;
};

const TextField = ({
  autoComplete,
  id,
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: TextFieldProps) => (
  <label className={styles.field} htmlFor={id}>
    <span>{label}</span>
    <input
      autoComplete={autoComplete}
      id={id}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  </label>
);

type TextAreaFieldProps = Omit<TextFieldProps, "type" | "autoComplete"> & {
  rows?: number;
};

const TextAreaField = ({
  id,
  label,
  onChange,
  placeholder,
  rows = 4,
  value,
}: TextAreaFieldProps) => (
  <label className={styles.field} htmlFor={id}>
    <span>{label}</span>
    <textarea
      id={id}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      value={value}
    />
  </label>
);

type EditorSectionProps = {
  children: React.ReactNode;
  id: string;
  initiallyOpen?: boolean;
  subtitle?: string;
  title: string;
};

const EditorSection = ({
  children,
  id,
  initiallyOpen = false,
  subtitle,
  title,
}: EditorSectionProps) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const contentId = `resume-editor-${id}-content`;

  return (
    <section className={styles.editorSection}>
      <h3 className={styles.sectionHeading}>
        <button
          aria-controls={isOpen ? contentId : undefined}
          aria-expanded={isOpen}
          className={styles.sectionToggle}
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          <span>
            <strong>{title}</strong>
            {subtitle && <small>{subtitle}</small>}
          </span>
          <span aria-hidden="true" className={styles.sectionToggleMark}>
            {isOpen ? "−" : "+"}
          </span>
        </button>
      </h3>
      {isOpen && (
        <div className={styles.sectionBody} id={contentId}>
          {children}
        </div>
      )}
    </section>
  );
};

type OrderButtonsProps = {
  index: number;
  label: string;
  length: number;
  onMove: (direction: -1 | 1) => void;
};

const OrderButtons = ({ index, label, length, onMove }: OrderButtonsProps) => (
  <span className={styles.orderButtons}>
    <button
      aria-label={`Move ${label} up`}
      disabled={index === 0}
      onClick={() => onMove(-1)}
      title="Move up"
      type="button"
    >
      ↑
    </button>
    <button
      aria-label={`Move ${label} down`}
      disabled={index === length - 1}
      onClick={() => onMove(1)}
      title="Move down"
      type="button"
    >
      ↓
    </button>
  </span>
);

type StringListEditorProps = {
  id: string;
  items: string[];
  label: string;
  onChange: (items: string[]) => void;
  placeholder?: string;
};

const StringListEditor = ({
  id,
  items,
  label,
  onChange,
  placeholder,
}: StringListEditorProps) => (
  <div className={styles.listEditor}>
    <div className={styles.listHeading}>
      <h4>{label}</h4>
      <span>{items.length}</span>
    </div>
    {items.length === 0 && (
      <p className={styles.emptyState}>No items yet. Add one when ready.</p>
    )}
    {items.map((item, index) => (
      <div className={styles.listRow} key={`${id}-${index}`}>
        <label className={styles.visuallyHidden} htmlFor={`${id}-${index}`}>
          {label} item {index + 1}
        </label>
        <input
          id={`${id}-${index}`}
          onChange={(event) => {
            const next = items.slice();
            next[index] = event.target.value;
            onChange(next);
          }}
          placeholder={placeholder}
          value={item}
        />
        <OrderButtons
          index={index}
          label={`${label} item ${index + 1}`}
          length={items.length}
          onMove={(direction) => onChange(moveItem(items, index, direction))}
        />
        <button
          aria-label={`Remove ${label} item ${index + 1}`}
          className={styles.removeButton}
          onClick={() =>
            onChange(items.filter((_, itemIndex) => itemIndex !== index))
          }
          title="Remove"
          type="button"
        >
          ×
        </button>
      </div>
    ))}
    <button
      className={styles.addButton}
      onClick={() => onChange([...items, ""])}
      type="button"
    >
      <span aria-hidden="true">＋</span> Add {label.toLowerCase()} item
    </button>
  </div>
);

const ResumeEditor = ({
  canRedo,
  canUndo,
  customization,
  data,
  jsonError,
  jsonString,
  onApplyJson,
  onClose,
  onCustomizationChange,
  onDataChange,
  onExport,
  onImportFile,
  onJsonChange,
  onRedo,
  onReset,
  onUndo,
}: ResumeEditorProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("content");
  const [accentDraft, setAccentDraft] = useState(
    customization.appearance.accent,
  );
  const importInputRef = useRef<HTMLInputElement>(null);
  const personalInfo = data.personalInfo || {};
  const about = data.about || {};
  const experience = data.experience || [];
  const openSource = data.openSource || {};
  const education = data.education || {};
  const projects = data.projects || [];

  useEffect(() => {
    setAccentDraft(customization.appearance.accent);
  }, [customization.appearance.accent]);

  const updatePersonalInfo = (key: keyof PersonalInfo, value: string) => {
    onDataChange({
      ...data,
      personalInfo: { ...personalInfo, [key]: value },
    });
  };

  const updateAbout = (key: keyof About, value: string) => {
    onDataChange({ ...data, about: { ...about, [key]: value } });
  };

  const updateEducation = (key: keyof Education, value: string) => {
    onDataChange({ ...data, education: { ...education, [key]: value } });
  };

  const updateOpenSource = (
    key: keyof OpenSource,
    value: string | string[],
  ) => {
    onDataChange({
      ...data,
      openSource: { ...openSource, [key]: value },
    });
  };

  const updateExperience = (nextExperience: Experience) => {
    onDataChange({ ...data, experience: nextExperience });
  };

  const updateCompany = (companyIndex: number, nextCompany: Company) => {
    const next = experience.slice();
    next[companyIndex] = nextCompany;
    updateExperience(next);
  };

  const updateRole = (
    companyIndex: number,
    roleIndex: number,
    nextRole: Role,
  ) => {
    const company = experience[companyIndex];
    const roles = (company.roles || []).slice();
    roles[roleIndex] = nextRole;
    updateCompany(companyIndex, { ...company, roles });
  };

  const updateProjects = (nextProjects: Projects) => {
    onDataChange({ ...data, projects: nextProjects });
  };

  const updateProject = (projectIndex: number, nextProject: Project) => {
    const next = projects.slice();
    next[projectIndex] = nextProject;
    updateProjects(next);
  };

  const updateAppearanceValues = (patch: Partial<ResumeAppearance>) => {
    onCustomizationChange({
      ...customization,
      appearance: { ...customization.appearance, ...patch },
    });
  };

  const updateAppearance = <Key extends keyof ResumeAppearance>(
    key: Key,
    value: ResumeAppearance[Key],
  ) => {
    updateAppearanceValues({ [key]: value });
  };

  const isPresetActive = (values: (typeof layoutPresets)[number]["values"]) =>
    Object.entries(values).every(
      ([key, value]) =>
        customization.appearance[key as keyof ResumeAppearance] === value,
    );

  const updateSections = (sections: ResumeSectionSetting[]) => {
    onCustomizationChange({ ...customization, sections });
  };

  const updateSection = (
    sectionIndex: number,
    patch: Partial<ResumeSectionSetting>,
  ) => {
    updateSections(
      customization.sections.map((section, index) =>
        index === sectionIndex ? { ...section, ...patch } : section,
      ),
    );
  };

  const selectTab = (tab: TabId, focus = false) => {
    setActiveTab(tab);
    if (focus) {
      window.requestAnimationFrame(() => {
        document.getElementById(`resume-editor-tab-${tab}`)?.focus();
      });
    }
  };

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    selectTab(tabs[nextIndex].id, true);
  };

  const confirmReset = () => {
    if (
      window.confirm(
        "Reset all resume content, section settings, and design choices?",
      )
    ) {
      onReset();
    }
  };

  const formatJson = () => {
    if (jsonError) return;
    try {
      onJsonChange(JSON.stringify(JSON.parse(jsonString), null, 2));
    } catch {
      // The parent owns validation and exposes the error state.
    }
  };

  return (
    <div className={styles.editor}>
      <header className={styles.editorHeader}>
        <div>
          <p className={styles.eyebrow}>PRIVATE · SAVED ON THIS DEVICE</p>
          <h2>Customize your resume</h2>
          <p>Change the content, order, visibility, and visual rhythm.</p>
        </div>
        <button
          aria-label="Show PDF preview"
          className={styles.closeButton}
          onClick={onClose}
          title="Show PDF preview"
          type="button"
        >
          ×
        </button>
      </header>

      <div className={styles.utilityBar}>
        <div
          aria-label="Edit history"
          className={styles.utilityGroup}
          role="group"
        >
          <button
            className={styles.utilityButton}
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo the last editor change"
            type="button"
          >
            <span aria-hidden="true">↶</span> Undo
          </button>
          <button
            className={styles.utilityButton}
            disabled={!canRedo}
            onClick={onRedo}
            title="Redo the last undone change"
            type="button"
          >
            Redo <span aria-hidden="true">↷</span>
          </button>
        </div>
        <div
          aria-label="Resume file tools"
          className={styles.utilityGroup}
          role="group"
        >
          <input
            accept="application/json,.json"
            aria-label="Import resume JSON file"
            className={styles.visuallyHidden}
            id="resume-editor-import"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onImportFile(file);
              event.target.value = "";
            }}
            ref={importInputRef}
            tabIndex={-1}
            type="file"
          />
          <button
            className={styles.utilityButton}
            onClick={() => importInputRef.current?.click()}
            type="button"
          >
            Import
          </button>
          <button
            className={styles.utilityButton}
            onClick={onExport}
            type="button"
          >
            Export
          </button>
        </div>
        <button
          className={`${styles.utilityButton} ${styles.dangerButton}`}
          onClick={confirmReset}
          type="button"
        >
          Reset all
        </button>
      </div>

      <div aria-label="Resume editor" className={styles.tabs} role="tablist">
        {tabs.map((tab, index) => (
          <button
            aria-controls="resume-editor-panel"
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? styles.activeTab : ""}
            id={`resume-editor-tab-${tab.id}`}
            key={tab.id}
            onClick={() => selectTab(tab.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            role="tab"
            tabIndex={activeTab === tab.id ? 0 : -1}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        aria-labelledby={`resume-editor-tab-${activeTab}`}
        className={styles.tabPanel}
        id="resume-editor-panel"
        role="tabpanel"
        tabIndex={0}
      >
        {activeTab === "content" && (
          <div className={styles.panelStack}>
            <EditorSection
              id="personal"
              initiallyOpen
              subtitle="Contact and headline; experience is calculated from role dates"
              title="Personal details"
            >
              <div className={styles.fieldGrid}>
                {personalFields.map((field) => (
                  <TextField
                    autoComplete={field.autoComplete}
                    id={`resume-personal-${field.key}`}
                    key={field.key}
                    label={field.label}
                    onChange={(value) => updatePersonalInfo(field.key, value)}
                    type={field.type}
                    value={personalInfo[field.key] || ""}
                  />
                ))}
              </div>
            </EditorSection>

            <EditorSection
              id="profile"
              initiallyOpen
              subtitle="Your concise opening statement"
              title="Profile"
            >
              <TextField
                id="resume-about-title"
                label="Section title"
                onChange={(value) => updateAbout("title", value)}
                value={about.title || ""}
              />
              <TextAreaField
                id="resume-about-description"
                label="Profile summary"
                onChange={(value) => updateAbout("description", value)}
                rows={5}
                value={about.description || ""}
              />
            </EditorSection>

            <EditorSection
              id="experience"
              initiallyOpen
              subtitle={`${experience.length} ${experience.length === 1 ? "company" : "companies"}`}
              title="Professional experience"
            >
              {experience.length === 0 && (
                <p className={styles.emptyState}>
                  Add your first company to begin.
                </p>
              )}
              {experience.map((company, companyIndex) => {
                const roles = company.roles || [];
                const companyLabel =
                  company.company || `Company ${companyIndex + 1}`;
                return (
                  <article
                    className={styles.entryCard}
                    key={`company-${companyIndex}`}
                  >
                    <div className={styles.entryHeader}>
                      <div>
                        <span className={styles.entryIndex}>
                          {String(companyIndex + 1).padStart(2, "0")}
                        </span>
                        <h4>{companyLabel}</h4>
                      </div>
                      <div className={styles.entryActions}>
                        <OrderButtons
                          index={companyIndex}
                          label={companyLabel}
                          length={experience.length}
                          onMove={(direction) =>
                            updateExperience(
                              moveItem(experience, companyIndex, direction),
                            )
                          }
                        />
                        <button
                          aria-label={`Remove ${companyLabel}`}
                          className={styles.removeTextButton}
                          onClick={() =>
                            updateExperience(
                              experience.filter(
                                (_, index) => index !== companyIndex,
                              ),
                            )
                          }
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className={styles.fieldGrid}>
                      <TextField
                        id={`resume-company-${companyIndex}-name`}
                        label="Company"
                        onChange={(value) =>
                          updateCompany(companyIndex, {
                            ...company,
                            company: value,
                          })
                        }
                        value={company.company || ""}
                      />
                      <TextField
                        id={`resume-company-${companyIndex}-period`}
                        label="Company period"
                        onChange={(value) =>
                          updateCompany(companyIndex, {
                            ...company,
                            companyPeriod: value,
                          })
                        }
                        placeholder="Jan 2025 - Present"
                        value={company.companyPeriod || ""}
                      />
                    </div>

                    <div className={styles.subsectionHeading}>
                      <h5>Roles</h5>
                      <span>{roles.length}</span>
                    </div>
                    {roles.map((role, roleIndex) => {
                      const roleLabel =
                        role.position || `Role ${roleIndex + 1}`;
                      return (
                        <fieldset
                          className={styles.nestedCard}
                          key={`company-${companyIndex}-role-${roleIndex}`}
                        >
                          <legend>{roleLabel}</legend>
                          <div className={styles.entryActions}>
                            <OrderButtons
                              index={roleIndex}
                              label={roleLabel}
                              length={roles.length}
                              onMove={(direction) =>
                                updateCompany(companyIndex, {
                                  ...company,
                                  roles: moveItem(roles, roleIndex, direction),
                                })
                              }
                            />
                            <button
                              aria-label={`Remove role ${roleLabel}`}
                              className={styles.removeTextButton}
                              onClick={() =>
                                updateCompany(companyIndex, {
                                  ...company,
                                  roles: roles.filter(
                                    (_, index) => index !== roleIndex,
                                  ),
                                })
                              }
                              type="button"
                            >
                              Remove role
                            </button>
                          </div>
                          <div className={styles.fieldGrid}>
                            <TextField
                              id={`resume-company-${companyIndex}-role-${roleIndex}-position`}
                              label="Position"
                              onChange={(value) =>
                                updateRole(companyIndex, roleIndex, {
                                  ...role,
                                  position: value,
                                })
                              }
                              value={role.position || ""}
                            />
                            <TextField
                              id={`resume-company-${companyIndex}-role-${roleIndex}-period`}
                              label="Role period"
                              onChange={(value) =>
                                updateRole(companyIndex, roleIndex, {
                                  ...role,
                                  period: value,
                                })
                              }
                              placeholder="Jan 2025 - Present"
                              value={role.period || ""}
                            />
                          </div>
                          <StringListEditor
                            id={`resume-company-${companyIndex}-role-${roleIndex}-responsibility`}
                            items={role.responsibilities || []}
                            label="Responsibility"
                            onChange={(responsibilities) =>
                              updateRole(companyIndex, roleIndex, {
                                ...role,
                                responsibilities,
                              })
                            }
                            placeholder="Describe an outcome, scale, or impact"
                          />
                        </fieldset>
                      );
                    })}
                    <button
                      className={styles.addButton}
                      onClick={() =>
                        updateCompany(companyIndex, {
                          ...company,
                          roles: [...roles, emptyRole()],
                        })
                      }
                      type="button"
                    >
                      <span aria-hidden="true">＋</span> Add role
                    </button>
                  </article>
                );
              })}
              <button
                className={`${styles.addButton} ${styles.primaryAddButton}`}
                onClick={() =>
                  updateExperience([...experience, emptyCompany()])
                }
                type="button"
              >
                <span aria-hidden="true">＋</span> Add company
              </button>
            </EditorSection>

            <EditorSection
              id="capabilities"
              subtitle="Every item can be reordered"
              title="Skills and capabilities"
            >
              <div className={styles.panelStack}>
                {skillLists.map((list) => (
                  <StringListEditor
                    id={`resume-${list.key}`}
                    items={data[list.key] || []}
                    key={list.key}
                    label={list.label}
                    onChange={(items) =>
                      onDataChange({ ...data, [list.key]: items })
                    }
                  />
                ))}
              </div>
            </EditorSection>

            <EditorSection
              id="open-source"
              subtitle="Project name and contribution highlights"
              title="Open source"
            >
              <div className={styles.fieldGrid}>
                <TextField
                  id="resume-open-source-title"
                  label="Project"
                  onChange={(value) => updateOpenSource("title", value)}
                  value={openSource.title || ""}
                />
                <TextField
                  id="resume-open-source-subtitle"
                  label="Subtitle"
                  onChange={(value) => updateOpenSource("subtitle", value)}
                  value={openSource.subtitle || ""}
                />
              </div>
              <StringListEditor
                id="resume-open-source-contribution"
                items={openSource.contributions || []}
                label="Contribution"
                onChange={(items) => updateOpenSource("contributions", items)}
              />
            </EditorSection>

            <EditorSection
              id="education"
              subtitle="Degree and institution details"
              title="Education"
            >
              <div className={styles.fieldGrid}>
                {(
                  [
                    ["degree", "Degree"],
                    ["field", "Field of study"],
                    ["institution", "Institution"],
                    ["location", "Location"],
                    ["period", "Period"],
                    ["grade", "Grade"],
                  ] as Array<[keyof Education, string]>
                ).map(([key, label]) => (
                  <TextField
                    id={`resume-education-${key}`}
                    key={key}
                    label={label}
                    onChange={(value) => updateEducation(key, value)}
                    value={education[key] || ""}
                  />
                ))}
              </div>
            </EditorSection>

            <EditorSection
              id="projects"
              subtitle={`${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
              title="Personal projects"
            >
              {projects.length === 0 && (
                <p className={styles.emptyState}>No projects yet.</p>
              )}
              {projects.map((project, projectIndex) => {
                const projectLabel =
                  project.name || `Project ${projectIndex + 1}`;
                return (
                  <article
                    className={styles.entryCard}
                    key={`project-${projectIndex}`}
                  >
                    <div className={styles.entryHeader}>
                      <h4>{projectLabel}</h4>
                      <div className={styles.entryActions}>
                        <OrderButtons
                          index={projectIndex}
                          label={projectLabel}
                          length={projects.length}
                          onMove={(direction) =>
                            updateProjects(
                              moveItem(projects, projectIndex, direction),
                            )
                          }
                        />
                        <button
                          aria-label={`Remove ${projectLabel}`}
                          className={styles.removeTextButton}
                          onClick={() =>
                            updateProjects(
                              projects.filter(
                                (_, index) => index !== projectIndex,
                              ),
                            )
                          }
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <TextField
                      id={`resume-project-${projectIndex}-name`}
                      label="Project name"
                      onChange={(value) =>
                        updateProject(projectIndex, { ...project, name: value })
                      }
                      value={project.name || ""}
                    />
                    <TextAreaField
                      id={`resume-project-${projectIndex}-description`}
                      label="Description"
                      onChange={(value) =>
                        updateProject(projectIndex, {
                          ...project,
                          description: value,
                        })
                      }
                      rows={3}
                      value={project.description || ""}
                    />
                    <StringListEditor
                      id={`resume-project-${projectIndex}-detail`}
                      items={project.details || []}
                      label="Project detail"
                      onChange={(details) =>
                        updateProject(projectIndex, { ...project, details })
                      }
                    />
                  </article>
                );
              })}
              <button
                className={`${styles.addButton} ${styles.primaryAddButton}`}
                onClick={() => updateProjects([...projects, emptyProject()])}
                type="button"
              >
                <span aria-hidden="true">＋</span> Add project
              </button>
            </EditorSection>
          </div>
        )}

        {activeTab === "sections" && (
          <div className={styles.panelStack}>
            <div className={styles.panelIntro}>
              <p className={styles.eyebrow}>STORY ORDER</p>
              <h3>Choose what appears and where.</h3>
              <p>
                Move sections into your preferred reading order. Placement is
                used by templates that support two columns.
              </p>
            </div>
            <ol className={styles.sectionList}>
              {customization.sections.map((section, sectionIndex) => (
                <li className={styles.sectionRow} key={section.id}>
                  <span className={styles.sectionNumber}>
                    {String(sectionIndex + 1).padStart(2, "0")}
                  </span>
                  <label className={styles.visibilityToggle}>
                    <input
                      aria-label={`${section.label}: ${
                        section.visible ? "shown" : "hidden"
                      }`}
                      checked={section.visible}
                      onChange={(event) =>
                        updateSection(sectionIndex, {
                          visible: event.target.checked,
                        })
                      }
                      type="checkbox"
                    />
                    <span>{section.visible ? "Shown" : "Hidden"}</span>
                  </label>
                  <label
                    className={styles.field}
                    htmlFor={`section-label-${section.id}`}
                  >
                    <span>Section label</span>
                    <input
                      id={`section-label-${section.id}`}
                      onChange={(event) =>
                        updateSection(sectionIndex, {
                          label: event.target.value,
                        })
                      }
                      value={section.label}
                    />
                  </label>
                  <label
                    className={styles.field}
                    htmlFor={`section-placement-${section.id}`}
                  >
                    <span>Placement</span>
                    <select
                      id={`section-placement-${section.id}`}
                      onChange={(event) =>
                        updateSection(sectionIndex, {
                          placement:
                            event.target.value === "main" ? "main" : "sidebar",
                        })
                      }
                      value={section.placement}
                    >
                      <option value="main">Main column</option>
                      <option value="sidebar">Sidebar</option>
                    </select>
                  </label>
                  <OrderButtons
                    index={sectionIndex}
                    label={section.label}
                    length={customization.sections.length}
                    onMove={(direction) =>
                      updateSections(
                        moveItem(
                          customization.sections,
                          sectionIndex,
                          direction,
                        ),
                      )
                    }
                  />
                </li>
              ))}
            </ol>
          </div>
        )}

        {activeTab === "design" && (
          <div className={styles.panelStack}>
            <div className={styles.panelIntro}>
              <p className={styles.eyebrow}>ADAPTIVE TYPESETTING</p>
              <h3>Control the visual rhythm.</h3>
              <p>
                Auto density responds to content length. Manual controls let you
                fine-tune the result without fixed-height clipping.
              </p>
            </div>

            <section
              className={styles.designGroup}
              aria-labelledby="resume-color-title"
            >
              <div className={styles.designGroupHeader}>
                <div>
                  <h4 id="resume-color-title">Color</h4>
                  <p>Use the template palette or make the accent your own.</p>
                </div>
                <button
                  className={styles.resetGroupButton}
                  onClick={() =>
                    updateAppearanceValues({
                      accent: defaultAppearance.accent,
                      useTemplateAccent: defaultAppearance.useTemplateAccent,
                    })
                  }
                  type="button"
                >
                  Reset color
                </button>
              </div>
              <label className={styles.switchRow}>
                <input
                  checked={customization.appearance.useTemplateAccent}
                  onChange={(event) =>
                    updateAppearance("useTemplateAccent", event.target.checked)
                  }
                  type="checkbox"
                />
                <span>Use template accent</span>
              </label>
              <div className={styles.colorFields}>
                <label
                  className={styles.colorPicker}
                  htmlFor="resume-accent-color"
                >
                  <span>Accent color</span>
                  <input
                    disabled={customization.appearance.useTemplateAccent}
                    id="resume-accent-color"
                    onChange={(event) =>
                      updateAppearance("accent", event.target.value)
                    }
                    type="color"
                    value={customization.appearance.accent}
                  />
                </label>
                <label className={styles.field} htmlFor="resume-accent-hex">
                  <span>Hex value</span>
                  <input
                    aria-invalid={!/^#[0-9a-f]{6}$/i.test(accentDraft)}
                    disabled={customization.appearance.useTemplateAccent}
                    id="resume-accent-hex"
                    onBlur={() => {
                      if (!/^#[0-9a-f]{6}$/i.test(accentDraft)) {
                        setAccentDraft(customization.appearance.accent);
                      }
                    }}
                    onChange={(event) => {
                      const nextAccent = event.target.value;
                      setAccentDraft(nextAccent);
                      if (/^#[0-9a-f]{6}$/i.test(nextAccent)) {
                        updateAppearance("accent", nextAccent);
                      }
                    }}
                    spellCheck={false}
                    value={accentDraft}
                  />
                </label>
              </div>
            </section>

            <section
              className={styles.designGroup}
              aria-labelledby="resume-format-title"
            >
              <div className={styles.designGroupHeader}>
                <div>
                  <h4 id="resume-format-title">Format</h4>
                  <p>Choose page, type, and automatic spacing behavior.</p>
                </div>
                <button
                  className={styles.resetGroupButton}
                  onClick={() =>
                    updateAppearanceValues({
                      density: defaultAppearance.density,
                      fontFamily: defaultAppearance.fontFamily,
                      pageSize: defaultAppearance.pageSize,
                    })
                  }
                  type="button"
                >
                  Reset format
                </button>
              </div>
              <div className={styles.fieldGrid}>
                <label className={styles.field} htmlFor="resume-density">
                  <span>Density</span>
                  <select
                    id="resume-density"
                    onChange={(event) =>
                      updateAppearance(
                        "density",
                        event.target.value as ResumeAppearance["density"],
                      )
                    }
                    value={customization.appearance.density}
                  >
                    <option value="auto">Auto — based on content</option>
                    <option value="comfortable">Comfortable</option>
                    <option value="balanced">Balanced</option>
                    <option value="compact">Compact</option>
                  </select>
                </label>
                <label className={styles.field} htmlFor="resume-font-family">
                  <span>Font family</span>
                  <select
                    id="resume-font-family"
                    onChange={(event) =>
                      updateAppearance(
                        "fontFamily",
                        event.target.value as ResumeAppearance["fontFamily"],
                      )
                    }
                    value={customization.appearance.fontFamily}
                  >
                    <option value="template">Template default</option>
                    <option value="helvetica">Helvetica</option>
                    <option value="times">Times</option>
                    <option value="courier">Courier</option>
                  </select>
                </label>
                <label className={styles.field} htmlFor="resume-page-size">
                  <span>Page size</span>
                  <select
                    id="resume-page-size"
                    onChange={(event) =>
                      updateAppearance(
                        "pageSize",
                        event.target.value as ResumeAppearance["pageSize"],
                      )
                    }
                    value={customization.appearance.pageSize}
                  >
                    <option value="A4">A4</option>
                    <option value="LETTER">US Letter</option>
                  </select>
                </label>
              </div>
              <div
                aria-label="Layout rhythm presets"
                className={styles.presetGrid}
                role="group"
              >
                {layoutPresets.map((preset) => {
                  const isActive = isPresetActive(preset.values);
                  return (
                    <button
                      aria-pressed={isActive}
                      className={`${styles.presetButton} ${
                        isActive ? styles.presetButtonActive : ""
                      }`}
                      key={preset.label}
                      onClick={() => updateAppearanceValues(preset.values)}
                      type="button"
                    >
                      <strong>{preset.label}</strong>
                      <span>{preset.description}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section
              className={styles.designGroup}
              aria-labelledby="resume-scale-title"
            >
              <div className={styles.designGroupHeader}>
                <div>
                  <h4 id="resume-scale-title">Fine tuning</h4>
                  <p>Small adjustments are safest for readable PDF output.</p>
                </div>
                <button
                  className={styles.resetGroupButton}
                  onClick={() =>
                    updateAppearanceValues({
                      fontScale: defaultAppearance.fontScale,
                      lineSpacing: defaultAppearance.lineSpacing,
                      pageMargin: defaultAppearance.pageMargin,
                      spacingScale: defaultAppearance.spacingScale,
                    })
                  }
                  type="button"
                >
                  Reset rhythm
                </button>
              </div>
              <label className={styles.rangeField} htmlFor="resume-font-scale">
                <span>
                  Font size{" "}
                  <output>
                    {Math.round(customization.appearance.fontScale * 100)}%
                  </output>
                </span>
                <input
                  id="resume-font-scale"
                  max="1.16"
                  min="0.86"
                  onChange={(event) =>
                    updateAppearance("fontScale", Number(event.target.value))
                  }
                  step="0.01"
                  type="range"
                  value={customization.appearance.fontScale}
                />
              </label>
              <label
                className={styles.rangeField}
                htmlFor="resume-line-spacing"
              >
                <span>
                  Line spacing{" "}
                  <output>
                    {customization.appearance.lineSpacing.toFixed(2)}×
                  </output>
                </span>
                <input
                  id="resume-line-spacing"
                  max="1.3"
                  min="0.85"
                  onChange={(event) =>
                    updateAppearance("lineSpacing", Number(event.target.value))
                  }
                  step="0.01"
                  type="range"
                  value={customization.appearance.lineSpacing}
                />
              </label>
              <label
                className={styles.rangeField}
                htmlFor="resume-spacing-scale"
              >
                <span>
                  Section spacing{" "}
                  <output>
                    {Math.round(customization.appearance.spacingScale * 100)}%
                  </output>
                </span>
                <input
                  id="resume-spacing-scale"
                  max="1.35"
                  min="0.72"
                  onChange={(event) =>
                    updateAppearance("spacingScale", Number(event.target.value))
                  }
                  step="0.01"
                  type="range"
                  value={customization.appearance.spacingScale}
                />
              </label>
              <label className={styles.rangeField} htmlFor="resume-page-margin">
                <span>
                  Page margin{" "}
                  <output>
                    {Math.round(customization.appearance.pageMargin * 100)}%
                  </output>
                </span>
                <input
                  id="resume-page-margin"
                  max="1.35"
                  min="0.72"
                  onChange={(event) =>
                    updateAppearance("pageMargin", Number(event.target.value))
                  }
                  step="0.01"
                  type="range"
                  value={customization.appearance.pageMargin}
                />
              </label>
            </section>
          </div>
        )}

        {activeTab === "advanced" && (
          <div className={styles.panelStack}>
            <div className={styles.panelIntro}>
              <p className={styles.eyebrow}>ADVANCED SOURCE</p>
              <h3>Edit the complete JSON document.</h3>
              <p>
                Changes here stay local until you apply them. The visual editor
                remains the safer option for everyday updates.
              </p>
            </div>
            <label className={styles.field} htmlFor="resume-json-source">
              <span>Resume JSON</span>
              <textarea
                aria-describedby={jsonError ? "resume-json-error" : undefined}
                aria-invalid={Boolean(jsonError)}
                className={styles.jsonEditor}
                id="resume-json-source"
                onChange={(event) => onJsonChange(event.target.value)}
                spellCheck={false}
                value={jsonString}
              />
            </label>
            {jsonError && (
              <div className={styles.jsonError} id="resume-json-error">
                <strong>JSON needs attention</strong>
                <p>{jsonError}</p>
              </div>
            )}
            <div className={styles.advancedActions}>
              <button
                className={styles.utilityButton}
                disabled={Boolean(jsonError)}
                onClick={formatJson}
                type="button"
              >
                Format JSON
              </button>
              <button
                className={styles.applyButton}
                disabled={Boolean(jsonError)}
                onClick={onApplyJson}
                type="button"
              >
                Apply JSON changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeEditor;
export type { ResumeEditorProps };
