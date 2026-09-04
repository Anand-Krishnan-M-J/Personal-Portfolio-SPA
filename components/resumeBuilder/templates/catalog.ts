export type ResumeTemplateDefinition = {
  accent: string;
  background: string;
  description: string;
  id: string;
  family: "classic" | "expressive";
  isDefault?: boolean;
  layout: string;
  name: string;
};

export const DEFAULT_RESUME_TEMPLATE_ID = "original";

const safeFileNamePart = (value?: string, maximumLength = 64) =>
  (value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\u0080-\uFFFF]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, maximumLength)
    .replace(/_+$/g, "");

/**
 * Builds a portable PDF filename from the name currently entered in the
 * studio. Template labels are included for variants so separate downloads do
 * not overwrite one another; the default template keeps the concise name.
 */
export const getResumeFileName = (
  template: Pick<ResumeTemplateDefinition, "isDefault" | "name">,
  resumeName?: string,
) => {
  const person = safeFileNamePart(resumeName);
  const variant = template.isDefault ? "" : safeFileNamePart(template.name, 40);
  const baseName = person ? `${person}_Resume` : "Resume";
  return `${baseName}${variant ? `_${variant}` : ""}.pdf`;
};

/** Lightweight catalog used by the editor before the PDF engine is needed. */
export const resumeTemplates: ResumeTemplateDefinition[] = [
  {
    accent: "#3498db",
    background: "#ffffff",
    description:
      "An adaptive builder clone of the portfolio resume; the homepage download remains unchanged.",
    family: "classic",
    id: DEFAULT_RESUME_TEMPLATE_ID,
    isDefault: true,
    layout: "Adaptive legacy clone",
    name: "Original",
  },
  {
    accent: "#3498db",
    background: "#ffffff",
    description:
      "The original card-and-timeline language with larger type and natural multi-page flow.",
    family: "classic",
    id: "classic-airy",
    layout: "Adaptive classic",
    name: "Classic Airy",
  },
  {
    accent: "#3498db",
    background: "#ffffff",
    description:
      "The familiar original structure with tighter, content-aware spacing for fast scanning.",
    family: "classic",
    id: "classic-compact",
    layout: "Compact classic",
    name: "Classic Compact",
  },
  {
    accent: "#173f6d",
    background: "#f8fafc",
    description:
      "Original-style cards and timeline with a deeper navy engineering palette.",
    family: "classic",
    id: "classic-navy",
    layout: "Navy classic",
    name: "Classic Navy",
  },
  {
    accent: "#30363d",
    background: "#ffffff",
    description:
      "A print-friendly grayscale interpretation that keeps the original hierarchy intact.",
    family: "classic",
    id: "classic-mono",
    layout: "Monochrome classic",
    name: "Classic Mono",
  },
  {
    accent: "#3498db",
    background: "#ffffff",
    description:
      "The original visual grammar with the supporting column moved to the left.",
    family: "classic",
    id: "classic-reverse",
    layout: "Reverse classic",
    name: "Classic Reverse",
  },
  {
    accent: "#2563eb",
    background: "#eaf2ff",
    description:
      "A crisp impact timeline that keeps career outcomes in the visual foreground.",
    family: "expressive",
    id: "signal-timeline",
    layout: "Impact timeline",
    name: "Signal Timeline",
  },
  {
    accent: "#06b6d4",
    background: "#071827",
    description:
      "A technical, blueprint-inspired layout for architecture and platform work.",
    family: "expressive",
    id: "systems-blueprint",
    layout: "Technical sidebar",
    name: "Systems Blueprint",
  },
  {
    accent: "#ef233c",
    background: "#f4f4f2",
    description:
      "Strong typography, disciplined spacing, and a modern editorial grid.",
    family: "expressive",
    id: "swiss-grid",
    layout: "Swiss single-column",
    name: "Swiss Grid",
  },
  {
    accent: "#9a6b2f",
    background: "#f1ede5",
    description:
      "A restrained senior-engineer format with classic typography and quiet authority.",
    family: "expressive",
    id: "executive-slate",
    layout: "Executive narrative",
    name: "Executive Slate",
  },
  {
    accent: "#65f28b",
    background: "#0b0f14",
    description:
      "A dark terminal aesthetic that still reads like a polished engineering resume.",
    family: "expressive",
    id: "terminal-craft",
    layout: "Terminal split",
    name: "Terminal Craft",
  },
  {
    accent: "#3155a6",
    background: "#f6f0e8",
    description:
      "Magazine-like hierarchy for a career story with experience as the lead feature.",
    family: "expressive",
    id: "editorial-engineer",
    layout: "Editorial spread",
    name: "Editorial Engineer",
  },
  {
    accent: "#f97316",
    background: "#fff1e8",
    description:
      "Outcome-led cards make scale, conversion, reach, and delivery work easy to scan.",
    family: "expressive",
    id: "metric-impact",
    layout: "Metric cards",
    name: "Metric Impact",
  },
  {
    accent: "#7c3aed",
    background: "#f0e8ff",
    description:
      "An expressive purple system balancing personality with professional structure.",
    family: "expressive",
    id: "aurora-columns",
    layout: "Aurora columns",
    name: "Aurora Columns",
  },
  {
    accent: "#111111",
    background: "#ffffff",
    description:
      "A clean, single-column, low-decoration option designed for ATS parsing.",
    family: "expressive",
    id: "monochrome-ats",
    layout: "ATS single-column",
    name: "Monochrome ATS",
  },
  {
    accent: "#0f766e",
    background: "#dff4f1",
    description:
      "A dense, fast-scanning composition for referrals and time-constrained reviewers.",
    family: "expressive",
    id: "compact-one-page",
    layout: "Compact sidebar",
    name: "Compact One-Page",
  },
];

export const CLASSIC_RESUME_TEMPLATE_COUNT = resumeTemplates.filter(
  (template) => template.family === "classic",
).length;

export const EXPRESSIVE_RESUME_TEMPLATE_COUNT = resumeTemplates.filter(
  (template) => template.family === "expressive",
).length;

export const getResumeTemplate = (id?: string) =>
  resumeTemplates.find((template) => template.id === id) || resumeTemplates[0];
