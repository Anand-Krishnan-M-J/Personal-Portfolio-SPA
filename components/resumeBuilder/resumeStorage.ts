import { CVData, ResumeCustomization, ResumeStudioExport } from "./types";
import {
  createDefaultCustomization,
  normalizeCustomization,
  normalizeCVData,
} from "./resumeLayout";

export const RESUME_STORAGE_KEY = "ak-resume-studio-v2";

export type ResumeDraft = {
  customization: ResumeCustomization;
  data: CVData;
  templateId?: string;
};

export type ParsedResumeDraft = ResumeDraft & {
  source: "content" | "studio";
};

const isRecord = (value: unknown): value is { [key: string]: unknown } =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const isStringList = (value: unknown) =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const hasStringFields = (value: { [key: string]: unknown }, fields: string[]) =>
  fields.every((field) => typeof value[field] === "string");

const isVersionedCVData = (value: { [key: string]: unknown }) => {
  if (
    !isRecord(value.personalInfo) ||
    !hasStringFields(value.personalInfo, [
      "name",
      "title",
      "experience",
      "location",
      "phone",
      "email",
      "linkedin",
      "github",
      "website",
    ]) ||
    !isRecord(value.about) ||
    !hasStringFields(value.about, ["title", "description"]) ||
    !isStringList(value.technicalExpertise) ||
    !isStringList(value.skills) ||
    !isStringList(value.methodology) ||
    !isStringList(value.tools) ||
    !Array.isArray(value.experience) ||
    !isRecord(value.openSource) ||
    !hasStringFields(value.openSource, ["title", "subtitle"]) ||
    !isStringList(value.openSource.contributions) ||
    !isRecord(value.education) ||
    !hasStringFields(value.education, [
      "degree",
      "period",
      "field",
      "institution",
      "location",
      "grade",
    ]) ||
    !Array.isArray(value.projects)
  ) {
    return false;
  }

  const validExperience = value.experience.every(
    (company) =>
      isRecord(company) &&
      hasStringFields(company, ["company", "companyPeriod"]) &&
      Array.isArray(company.roles) &&
      company.roles.every(
        (role) =>
          isRecord(role) &&
          hasStringFields(role, ["position", "period"]) &&
          isStringList(role.responsibilities),
      ),
  );
  const validProjects = value.projects.every(
    (project) =>
      isRecord(project) &&
      hasStringFields(project, ["name", "description"]) &&
      isStringList(project.details),
  );

  return validExperience && validProjects;
};

const isVersionedCustomization = (value: { [key: string]: unknown }) => {
  if (!isRecord(value.appearance) || !Array.isArray(value.sections)) {
    return false;
  }
  const appearance = value.appearance;
  const validAppearance =
    typeof appearance.accent === "string" &&
    typeof appearance.density === "string" &&
    typeof appearance.fontFamily === "string" &&
    typeof appearance.fontScale === "number" &&
    Number.isFinite(appearance.fontScale) &&
    (appearance.lineSpacing === undefined ||
      (typeof appearance.lineSpacing === "number" &&
        Number.isFinite(appearance.lineSpacing))) &&
    typeof appearance.pageMargin === "number" &&
    Number.isFinite(appearance.pageMargin) &&
    typeof appearance.pageSize === "string" &&
    typeof appearance.spacingScale === "number" &&
    Number.isFinite(appearance.spacingScale) &&
    typeof appearance.useTemplateAccent === "boolean";
  const validSections =
    value.sections.length > 0 &&
    value.sections.every(
      (section) =>
        isRecord(section) &&
        typeof section.id === "string" &&
        typeof section.label === "string" &&
        typeof section.placement === "string" &&
        typeof section.visible === "boolean",
    );

  return validAppearance && validSections;
};

const hasText = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

const hasResumeContent = (data: CVData) => {
  const personalInfo = data.personalInfo || {};
  const about = data.about || {};
  const openSource = data.openSource || {};
  const education = data.education || {};

  return Boolean(
    Object.values(personalInfo).some(hasText) ||
    Object.values(about).some(hasText) ||
    data.technicalExpertise?.some(hasText) ||
    data.skills?.some(hasText) ||
    data.methodology?.some(hasText) ||
    data.tools?.some(hasText) ||
    data.experience?.some(
      (company) =>
        hasText(company.company) ||
        hasText(company.companyPeriod) ||
        company.roles?.some(
          (role) =>
            hasText(role.position) ||
            hasText(role.period) ||
            role.responsibilities?.some(hasText),
        ),
    ) ||
    hasText(openSource.title) ||
    hasText(openSource.subtitle) ||
    openSource.contributions?.some(hasText) ||
    Object.values(education).some(hasText) ||
    data.projects?.some(
      (project) =>
        hasText(project.name) ||
        hasText(project.description) ||
        project.details?.some(hasText),
    ),
  );
};

const validatedCVData = (value: unknown) => {
  if (!isRecord(value)) {
    throw new Error("Resume data must be a JSON object.");
  }
  const data = normalizeCVData(value);
  if (!hasResumeContent(data)) {
    throw new Error(
      "No recognizable resume content was found. Import a Resume Studio export or a CV data object.",
    );
  }
  return data;
};

export const parseResumeDraft = (value: unknown): ParsedResumeDraft => {
  if (!isRecord(value)) throw new Error("Resume data must be a JSON object.");

  if (value.version === 2) {
    if (!isRecord(value.data) || !isVersionedCVData(value.data)) {
      throw new Error("This Resume Studio file has invalid resume data.");
    }
    if (
      !isRecord(value.customization) ||
      !isVersionedCustomization(value.customization)
    ) {
      throw new Error("This Resume Studio file has invalid design settings.");
    }
    return {
      customization: normalizeCustomization(
        value.customization as Partial<ResumeCustomization>,
      ),
      data: normalizeCVData(value.data),
      source: "studio",
      templateId:
        typeof value.templateId === "string" && value.templateId.trim()
          ? value.templateId.trim()
          : undefined,
    };
  }

  return {
    customization: createDefaultCustomization(),
    data: validatedCVData(value),
    source: "content",
  };
};

export const loadResumeDraft = (): ResumeDraft | null => {
  try {
    const stored = window.localStorage.getItem(RESUME_STORAGE_KEY);
    if (!stored) return null;
    return parseResumeDraft(JSON.parse(stored));
  } catch (_error) {
    return null;
  }
};

export const saveResumeDraft = (draft: ResumeDraft) => {
  const payload: ResumeStudioExport = {
    customization: normalizeCustomization(draft.customization),
    data: normalizeCVData(draft.data),
    templateId: draft.templateId,
    version: 2,
  };
  try {
    window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (_error) {
    return false;
  }
};

export const serializeResumeDraft = (draft: ResumeDraft) => {
  const payload: ResumeStudioExport = {
    customization: normalizeCustomization(draft.customization),
    data: normalizeCVData(draft.data),
    templateId: draft.templateId,
    version: 2,
  };
  return JSON.stringify(payload, null, 2);
};
