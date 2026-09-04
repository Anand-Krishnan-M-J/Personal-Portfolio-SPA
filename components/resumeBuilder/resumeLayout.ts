import {
  CVData,
  ResumeCustomization,
  ResumeDensity,
  ResumeSectionId,
  ResumeSectionSetting,
} from "./types";

type UnknownRecord = { [key: string]: unknown };

export type ResolvedDensity = {
  contentScore: number;
  fontFactor: number;
  label: "comfortable" | "balanced" | "compact";
  spacingFactor: number;
};

const sectionDefaults: ResumeSectionSetting[] = [
  {
    id: "experience",
    label: "Professional experience",
    placement: "main",
    visible: true,
  },
  {
    id: "profile",
    label: "Profile",
    placement: "sidebar",
    visible: true,
  },
  {
    id: "technicalExpertise",
    label: "Core expertise",
    placement: "sidebar",
    visible: true,
  },
  {
    id: "skills",
    label: "Skills",
    placement: "sidebar",
    visible: true,
  },
  {
    id: "methodology",
    label: "Approach",
    placement: "sidebar",
    visible: true,
  },
  {
    id: "tools",
    label: "Tools",
    placement: "sidebar",
    visible: true,
  },
  {
    id: "openSource",
    label: "Open source",
    placement: "main",
    visible: true,
  },
  {
    id: "education",
    label: "Education",
    placement: "sidebar",
    visible: true,
  },
  {
    id: "projects",
    label: "Selected personal work",
    placement: "main",
    visible: true,
  },
];

export const DEFAULT_RESUME_CUSTOMIZATION: ResumeCustomization = {
  appearance: {
    accent: "#3498db",
    density: "auto",
    fontFamily: "template",
    fontScale: 1,
    lineSpacing: 1,
    pageMargin: 1,
    pageSize: "A4",
    spacingScale: 1,
    useTemplateAccent: true,
  },
  sections: sectionDefaults,
};

const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const stringValue = (value: unknown) =>
  typeof value === "string" ? value : "";

const stringList = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

const safePdfWebUrl = (value?: string) => {
  const trimmed = value?.trim() ?? "";
  if (
    !trimmed ||
    trimmed.length > 2048 ||
    /[\u0000-\u001f\u007f]/.test(trimmed)
  ) {
    return "";
  }
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" ? url.toString() : "";
  } catch (_error) {
    return "";
  }
};

const safePdfEmail = (value?: string) => {
  const trimmed = value?.trim() ?? "";
  return trimmed.length <= 254 &&
    /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(trimmed)
    ? trimmed
    : "";
};

const safePdfPhone = (value?: string) => {
  const trimmed = value?.trim() ?? "";
  return trimmed.length <= 40 && /^[+0-9().\-\s]{3,40}$/.test(trimmed)
    ? trimmed
    : "";
};

/** Keeps untrusted Studio imports from creating unsafe URI annotations in PDFs. */
export const sanitizeResumeLinksForPdf = (data: CVData): CVData => {
  if (!data.personalInfo) return data;
  return {
    ...data,
    personalInfo: {
      ...data.personalInfo,
      email: safePdfEmail(data.personalInfo.email),
      github: safePdfWebUrl(data.personalInfo.github),
      linkedin: safePdfWebUrl(data.personalInfo.linkedin),
      phone: safePdfPhone(data.personalInfo.phone),
      website: safePdfWebUrl(data.personalInfo.website),
    },
  };
};

const numberInRange = (
  value: unknown,
  fallback: number,
  minimum: number,
  maximum: number,
) => {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, minimum), maximum);
};

const cloneSections = () => sectionDefaults.map((section) => ({ ...section }));

export const createDefaultCustomization = (): ResumeCustomization => ({
  appearance: { ...DEFAULT_RESUME_CUSTOMIZATION.appearance },
  sections: cloneSections(),
});

const portfolioDownloadSectionLayout: Pick<
  ResumeSectionSetting,
  "id" | "placement"
>[] = [
  { id: "profile", placement: "main" },
  { id: "experience", placement: "main" },
  { id: "projects", placement: "main" },
  { id: "technicalExpertise", placement: "sidebar" },
  { id: "skills", placement: "sidebar" },
  { id: "methodology", placement: "sidebar" },
  { id: "tools", placement: "sidebar" },
  { id: "openSource", placement: "sidebar" },
  { id: "education", placement: "sidebar" },
];

/**
 * Balances the fixed homepage resume without stretching the gaps between cards.
 * The Studio defaults stay unchanged so user-selected layouts are unaffected.
 */
export const createPortfolioDownloadCustomization = (): ResumeCustomization => {
  const customization = createDefaultCustomization();
  const settingById = new Map(
    customization.sections.map((section) => [section.id, section]),
  );

  return {
    ...customization,
    sections: portfolioDownloadSectionLayout.map(({ id, placement }) => ({
      ...settingById.get(id)!,
      placement,
    })),
  };
};

export const normalizeCVData = (value: unknown): CVData => {
  const source = isRecord(value) ? value : {};
  const personalInfo = isRecord(source.personalInfo) ? source.personalInfo : {};
  const about = isRecord(source.about) ? source.about : {};
  const openSource = isRecord(source.openSource) ? source.openSource : {};
  const education = isRecord(source.education) ? source.education : {};

  const experience = Array.isArray(source.experience)
    ? source.experience.filter(isRecord).map((company) => ({
        company: stringValue(company.company),
        companyPeriod: stringValue(company.companyPeriod),
        roles: Array.isArray(company.roles)
          ? company.roles.filter(isRecord).map((role) => ({
              period: stringValue(role.period),
              position: stringValue(role.position),
              responsibilities: stringList(role.responsibilities),
            }))
          : [],
      }))
    : [];

  const projects = Array.isArray(source.projects)
    ? source.projects.filter(isRecord).map((project) => ({
        description: stringValue(project.description),
        details: stringList(project.details),
        name: stringValue(project.name),
      }))
    : [];

  return {
    about: {
      description: stringValue(about.description),
      title: stringValue(about.title),
    },
    education: {
      degree: stringValue(education.degree),
      field: stringValue(education.field),
      grade: stringValue(education.grade),
      institution: stringValue(education.institution),
      location: stringValue(education.location),
      period: stringValue(education.period),
    },
    experience,
    methodology: stringList(source.methodology),
    openSource: {
      contributions: stringList(openSource.contributions),
      subtitle: stringValue(openSource.subtitle),
      title: stringValue(openSource.title),
    },
    personalInfo: {
      email: stringValue(personalInfo.email),
      experience: stringValue(personalInfo.experience),
      github: stringValue(personalInfo.github),
      linkedin: stringValue(personalInfo.linkedin),
      location: stringValue(personalInfo.location),
      name: stringValue(personalInfo.name),
      phone: stringValue(personalInfo.phone),
      title: stringValue(personalInfo.title),
      website: stringValue(personalInfo.website),
    },
    projects,
    skills: stringList(source.skills),
    technicalExpertise: stringList(source.technicalExpertise),
    tools: stringList(source.tools),
  };
};

export const normalizeCustomization = (
  value?: Partial<ResumeCustomization> | null,
): ResumeCustomization => {
  const defaults = createDefaultCustomization();
  const appearance = value?.appearance;
  const validAccent =
    typeof appearance?.accent === "string" &&
    /^#[0-9a-f]{6}$/i.test(appearance.accent)
      ? appearance.accent
      : defaults.appearance.accent;
  const densityValues: ResumeDensity[] = [
    "auto",
    "comfortable",
    "balanced",
    "compact",
  ];
  const density = densityValues.includes(appearance?.density as ResumeDensity)
    ? (appearance?.density as ResumeDensity)
    : defaults.appearance.density;
  const fontValues = ["template", "helvetica", "times", "courier"];
  const fontFamily = fontValues.includes(appearance?.fontFamily || "")
    ? appearance?.fontFamily || defaults.appearance.fontFamily
    : defaults.appearance.fontFamily;
  const pageSize = appearance?.pageSize === "LETTER" ? "LETTER" : "A4";

  const sectionMap = new Map<ResumeSectionId, ResumeSectionSetting>();
  value?.sections?.forEach((section) => {
    const defaultSection = sectionDefaults.find(
      (candidate) => candidate.id === section.id,
    );
    if (!defaultSection || sectionMap.has(section.id)) return;
    sectionMap.set(section.id, {
      id: section.id,
      label:
        typeof section.label === "string" && section.label.trim()
          ? section.label.trim()
          : defaultSection.label,
      placement: section.placement === "main" ? "main" : "sidebar",
      visible: section.visible !== false,
    });
  });

  sectionDefaults.forEach((section) => {
    if (!sectionMap.has(section.id)) sectionMap.set(section.id, { ...section });
  });

  return {
    appearance: {
      accent: validAccent,
      density,
      fontFamily: fontFamily as ResumeCustomization["appearance"]["fontFamily"],
      fontScale: numberInRange(appearance?.fontScale, 1, 0.86, 1.16),
      lineSpacing: numberInRange(appearance?.lineSpacing, 1, 0.85, 1.3),
      pageMargin: numberInRange(appearance?.pageMargin, 1, 0.72, 1.35),
      pageSize,
      spacingScale: numberInRange(appearance?.spacingScale, 1, 0.72, 1.35),
      useTemplateAccent: appearance?.useTemplateAccent !== false,
    },
    sections: Array.from(sectionMap.values()),
  };
};

export const getSectionSetting = (
  customization: ResumeCustomization,
  id: ResumeSectionId,
) =>
  customization.sections.find((section) => section.id === id) ||
  sectionDefaults.find((section) => section.id === id) ||
  sectionDefaults[0];

const countCharacters = (data: CVData) => JSON.stringify(data).length;

const visibleResumeData = (
  data: CVData,
  customization: ResumeCustomization,
): CVData => {
  const visible = new Set(
    customization.sections
      .filter((section) => section.visible)
      .map((section) => section.id),
  );

  return {
    personalInfo: data.personalInfo,
    about: visible.has("profile") ? data.about : undefined,
    experience: visible.has("experience") ? data.experience : undefined,
    technicalExpertise: visible.has("technicalExpertise")
      ? data.technicalExpertise
      : undefined,
    skills: visible.has("skills") ? data.skills : undefined,
    methodology: visible.has("methodology") ? data.methodology : undefined,
    tools: visible.has("tools") ? data.tools : undefined,
    openSource: visible.has("openSource") ? data.openSource : undefined,
    education: visible.has("education") ? data.education : undefined,
    projects: visible.has("projects") ? data.projects : undefined,
  };
};

const countListItems = (data: CVData) => {
  const roleCount =
    data.experience?.reduce(
      (total, company) => total + (company.roles?.length || 0),
      0,
    ) || 0;
  const responsibilityCount =
    data.experience?.reduce(
      (companyTotal, company) =>
        companyTotal +
        (company.roles?.reduce(
          (roleTotal, role) => roleTotal + (role.responsibilities?.length || 0),
          0,
        ) || 0),
      0,
    ) || 0;
  const skillCount =
    (data.technicalExpertise?.length || 0) +
    (data.skills?.length || 0) +
    (data.methodology?.length || 0) +
    (data.tools?.length || 0);
  const supportingCount =
    (data.openSource?.contributions?.length || 0) +
    (data.projects?.reduce(
      (total, project) => total + 1 + (project.details?.length || 0),
      0,
    ) || 0);

  return (
    roleCount * 2 +
    responsibilityCount * 2.4 +
    skillCount * 0.45 +
    supportingCount
  );
};

export const resolveDensity = (
  data: CVData,
  customization: ResumeCustomization,
): ResolvedDensity => {
  const visibleData = visibleResumeData(data, customization);
  const contentScore =
    countCharacters(visibleData) / 115 + countListItems(visibleData);
  const requested = customization.appearance.density;
  const label =
    requested === "auto"
      ? contentScore > 62
        ? "compact"
        : contentScore > 46
          ? "balanced"
          : "comfortable"
      : requested === "compact"
        ? "compact"
        : requested === "comfortable"
          ? "comfortable"
          : "balanced";
  const factors = {
    balanced: { fontFactor: 0.97, spacingFactor: 0.88 },
    comfortable: { fontFactor: 1, spacingFactor: 1.05 },
    compact: { fontFactor: 0.92, spacingFactor: 0.7 },
  };

  return {
    contentScore,
    fontFactor: factors[label].fontFactor * customization.appearance.fontScale,
    label,
    spacingFactor:
      factors[label].spacingFactor * customization.appearance.spacingScale,
  };
};

export const moveItem = <T>(items: T[], index: number, direction: -1 | 1) => {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = items.slice();
  const item = next[index];
  next[index] = next[nextIndex];
  next[nextIndex] = item;
  return next;
};
