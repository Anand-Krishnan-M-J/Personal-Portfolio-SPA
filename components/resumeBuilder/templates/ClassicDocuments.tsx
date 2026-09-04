import { ResumeDocumentProps } from "../types";

import { StyledResumeDocument, TemplateSpec } from "./TemplateDocuments";

const originalAdaptive: TemplateSpec = {
  adaptivePageFill: true,
  accent: "#3498db",
  background: "#ffffff",
  baseFontSize: 8.05,
  card: "#ffffff",
  contactIcons: true,
  displayFont: "Helvetica",
  fillStrength: 1,
  headerCard: true,
  headingFont: "Helvetica-Bold",
  ink: "#2c3e50",
  layout: "sidebar-right",
  line: "#dce4ea",
  muted: "#687785",
  pagePadding: 20,
  sectionCards: true,
  sidebar: "#f8fafc",
  sidebarPanel: false,
  spacingBias: 1.02,
  timeline: true,
};

const portfolioDownload: TemplateSpec = {
  ...originalAdaptive,
  baseFontSize: 8.75,
  pagePadding: 25,
  spacingBias: 1.16,
};

const classicAiry: TemplateSpec = {
  adaptivePageFill: true,
  accent: "#3498db",
  background: "#ffffff",
  baseFontSize: 8.1,
  card: "#ffffff",
  displayFont: "Helvetica",
  fillStrength: 0.75,
  headerCard: true,
  headingFont: "Helvetica-Bold",
  ink: "#2c3e50",
  layout: "sidebar-right",
  line: "#dce4ea",
  muted: "#687785",
  pagePadding: 28,
  sectionCards: true,
  sidebar: "#f8fafc",
  sidebarPanel: false,
  spacingBias: 0.98,
  timeline: true,
};

const classicCompact: TemplateSpec = {
  adaptivePageFill: true,
  accent: "#3498db",
  background: "#ffffff",
  baseFontSize: 7.45,
  card: "#ffffff",
  condense: true,
  dense: true,
  displayFont: "Helvetica",
  headerCard: true,
  headingFont: "Helvetica-Bold",
  ink: "#2c3e50",
  layout: "sidebar-right",
  line: "#d9e1e7",
  muted: "#6c7882",
  pagePadding: 20,
  sectionCards: true,
  sidebar: "#f8fafc",
  sidebarPanel: false,
  fillStrength: 1.15,
  spacingBias: 1,
  timeline: true,
};

const classicNavy: TemplateSpec = {
  adaptivePageFill: true,
  accent: "#173f6d",
  background: "#f8fafc",
  baseFontSize: 7.95,
  card: "#ffffff",
  displayFont: "Helvetica",
  headerCard: true,
  headingFont: "Helvetica-Bold",
  ink: "#142b44",
  layout: "sidebar-right",
  line: "#cbd7e3",
  muted: "#607287",
  pagePadding: 25,
  sectionCards: true,
  sidebar: "#edf3f8",
  sidebarPanel: false,
  timeline: true,
};

const classicMono: TemplateSpec = {
  adaptivePageFill: true,
  accent: "#30363d",
  background: "#ffffff",
  baseFontSize: 7.95,
  card: "#ffffff",
  displayFont: "Helvetica",
  headerCard: true,
  headingFont: "Helvetica-Bold",
  ink: "#202428",
  layout: "sidebar-right",
  line: "#cfd3d7",
  muted: "#60666c",
  pagePadding: 25,
  sectionCards: true,
  sidebar: "#f5f5f5",
  sidebarPanel: false,
  timeline: true,
};

const classicReverse: TemplateSpec = {
  adaptivePageFill: true,
  accent: "#3498db",
  background: "#ffffff",
  baseFontSize: 7.95,
  card: "#ffffff",
  displayFont: "Helvetica",
  headerCard: true,
  headingFont: "Helvetica-Bold",
  ink: "#2c3e50",
  layout: "sidebar-left",
  line: "#dce4ea",
  muted: "#687785",
  pagePadding: 25,
  sectionCards: true,
  sidebar: "#f8fafc",
  sidebarPanel: false,
  timeline: true,
};

export const OriginalBuilderDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={originalAdaptive} />
);

export const PortfolioDownloadDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={portfolioDownload} />
);

export const ClassicAiryDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={classicAiry} />
);

export const ClassicCompactDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={classicCompact} />
);

export const ClassicNavyDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={classicNavy} />
);

export const ClassicMonoDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={classicMono} />
);

export const ClassicReverseDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={classicReverse} />
);
