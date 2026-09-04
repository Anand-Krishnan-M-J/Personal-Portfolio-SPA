import { CVData, ResumeCustomization } from "./types";

export type ResumeTemplateFilter = "all" | "classic" | "expressive";

export type ResumeHistorySnapshot = {
  customization: ResumeCustomization;
  data: CVData;
  templateFilter?: ResumeTemplateFilter;
  templateId?: string;
};

export const createResumeHistorySnapshot = (
  data: CVData,
  customization: ResumeCustomization,
  templateId?: string,
  templateFilter?: ResumeTemplateFilter,
): ResumeHistorySnapshot => ({
  customization,
  data,
  ...(typeof templateId === "string" ? { templateFilter, templateId } : {}),
});

export const resumeValuesEqual = <Value>(left: Value, right: Value) =>
  JSON.stringify(left) === JSON.stringify(right);

export const isResumePreviewCurrent = (
  data: CVData,
  previewData: CVData,
  customization: ResumeCustomization,
  previewCustomization: ResumeCustomization,
  selectedTemplateId: string,
  previewTemplateId: string,
) =>
  data === previewData &&
  customization === previewCustomization &&
  selectedTemplateId === previewTemplateId;
