export interface CVData {
  personalInfo?: {
    name?: string;
    title?: string;
    experience?: string;
    location?: string;
    phone?: string;
    email?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  about?: {
    title?: string;
    description?: string;
  };
  technicalExpertise?: string[];
  skills?: string[];
  methodology?: string[];
  tools?: string[];
  experience?: Array<{
    company?: string;
    companyPeriod?: string;
    roles?: Array<{
      position?: string;
      period?: string;
      responsibilities?: string[];
    }>;
  }>;
  openSource?: {
    title?: string;
    subtitle?: string;
    contributions?: string[];
  };
  education?: {
    degree?: string;
    period?: string;
    field?: string;
    institution?: string;
    location?: string;
    grade?: string;
  };
  projects?: Array<{
    name?: string;
    description?: string;
    details?: string[];
  }>;
}

export type ResumeSectionId =
  | "profile"
  | "experience"
  | "technicalExpertise"
  | "skills"
  | "methodology"
  | "tools"
  | "openSource"
  | "education"
  | "projects";

export type ResumeSectionPlacement = "main" | "sidebar";
export type ResumeDensity = "auto" | "comfortable" | "balanced" | "compact";
export type ResumeFont = "template" | "helvetica" | "times" | "courier";
export type ResumePageSize = "A4" | "LETTER";

export interface ResumeSectionSetting {
  id: ResumeSectionId;
  label: string;
  placement: ResumeSectionPlacement;
  visible: boolean;
}

export interface ResumeAppearance {
  accent: string;
  density: ResumeDensity;
  fontFamily: ResumeFont;
  fontScale: number;
  lineSpacing: number;
  pageMargin: number;
  pageSize: ResumePageSize;
  spacingScale: number;
  useTemplateAccent: boolean;
}

export interface ResumeCustomization {
  appearance: ResumeAppearance;
  sections: ResumeSectionSetting[];
}

export interface ResumeStudioExport {
  version: 2;
  data: CVData;
  customization: ResumeCustomization;
  templateId?: string;
}

export interface ResumeDocumentProps {
  customization?: ResumeCustomization;
  data: CVData;
}
