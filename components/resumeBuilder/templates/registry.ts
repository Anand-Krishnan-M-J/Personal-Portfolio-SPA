import type { ComponentType } from "react";

import type { ResumeDocumentProps } from "../types";

import {
  ClassicAiryDocument,
  ClassicCompactDocument,
  ClassicMonoDocument,
  ClassicNavyDocument,
  ClassicReverseDocument,
  OriginalBuilderDocument,
} from "./ClassicDocuments";
import { getResumeTemplate } from "./catalog";
import {
  AuroraColumnsDocument,
  CompactOnePageDocument,
  EditorialEngineerDocument,
  ExecutiveSlateDocument,
  MetricImpactDocument,
  MonochromeAtsDocument,
  SignalTimelineDocument,
  SwissGridDocument,
  SystemsBlueprintDocument,
  TerminalCraftDocument,
} from "./TemplateDocuments";

const resumeDocumentComponents: Record<
  string,
  ComponentType<ResumeDocumentProps>
> = {
  original: OriginalBuilderDocument,
  "classic-airy": ClassicAiryDocument,
  "classic-compact": ClassicCompactDocument,
  "classic-navy": ClassicNavyDocument,
  "classic-mono": ClassicMonoDocument,
  "classic-reverse": ClassicReverseDocument,
  "signal-timeline": SignalTimelineDocument,
  "systems-blueprint": SystemsBlueprintDocument,
  "swiss-grid": SwissGridDocument,
  "executive-slate": ExecutiveSlateDocument,
  "terminal-craft": TerminalCraftDocument,
  "editorial-engineer": EditorialEngineerDocument,
  "metric-impact": MetricImpactDocument,
  "aurora-columns": AuroraColumnsDocument,
  "monochrome-ats": MonochromeAtsDocument,
  "compact-one-page": CompactOnePageDocument,
};

/** Resolves PDF components only inside the deferred renderer boundary. */
export const getResumeDocumentComponent = (templateId?: string) => {
  const template = getResumeTemplate(templateId);
  return resumeDocumentComponents[template.id] || OriginalBuilderDocument;
};
