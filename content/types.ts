export type PortfolioSectionId =
  "experience" | "work" | "about" | "skills" | "contact";

export type EmployerSchemaRelationship = "current" | "former";

export interface LocalImageAsset {
  alt: string;
  height: number;
  src: string;
  width: number;
}

export interface NavigationItem {
  href: string;
  id: string;
  label: string;
  section: PortfolioSectionId;
}

export interface PortfolioIdentity {
  displayName: string;
  fullName: string;
  initials: string;
  /** Public portfolio title. The resume-specific title lives in cv-data.json. */
  jobTitle: string;
  location: string;
  portrait: LocalImageAsset;
}

export type SocialImageMimeType = "image/jpeg" | "image/png" | "image/webp";

export interface SocialImageAsset extends LocalImageAsset {
  mimeType: SocialImageMimeType;
}

export interface PortfolioSeoConfig {
  applicationName: string;
  description: string;
  familyName: string;
  givenName: string;
  htmlLanguage: string;
  knowsAboutExtra: string[];
  openGraphLocale: string;
  ogCard: {
    awardLines: [string, string];
    taglineLines: [string, string];
  };
  siteName: string;
  siteUrl: string;
  socialImage: SocialImageAsset;
  title: string;
}

export interface HeaderCopy {
  homeAriaLabel: string;
  mobileNavigationLabel: string;
  primaryNavigationLabel: string;
  skipLink: string;
}

export interface HeroCopy {
  experienceBadgeSuffix: string;
  headlineEmphasis: string;
  headlineLead: string;
  intro: string;
  portraitIndex: string;
  primaryActionLabel: string;
  profileLocationLabel: string;
  profileStatement: string;
  resumeAriaLabel: string;
  resumeDefaultLabel: string;
  resumeFailedLabel: string;
  resumePreparingCompactLabel: string;
  resumePreparingLabel: string;
  scrollCueLabel: string;
}

export interface ExperienceCopy {
  caseLabel: string;
  heading: string;
  label: string;
  openSourceAffiliation: {
    cohort: string;
    logo: "y-combinator";
    name: string;
    sourceSubtitle: string;
  };
  openSourceLabel: string;
  tenureLabel: string;
  tenurePrefix: string;
  tenureSuffix: string;
  timelineNowLabel: string;
}

export interface WorkCopy {
  heading: string;
  intro: string;
  label: string;
  projectLinkLabel: string;
  projectNumber: string;
  technologiesAriaLabel: string;
  visitLabel: string;
  wordmark: string;
}

export interface AboutCopy {
  body: string;
  heading: string;
  label: string;
}

export interface SkillsCopy {
  capabilitiesLabel: string;
  heading: string;
  intro: string;
}

export interface ContactCopy {
  atmosphereWord: string;
  availabilityAriaLabel: string;
  availabilityStatement: string;
  availabilityStatus: string;
  codeLabel: string;
  emailActionLabel: string;
  emailLabel: string;
  heading: string;
  intro: string;
  label: string;
  locationStatement: string;
  networkLabel: string;
}

export interface FooterCopy {
  backToTopLabel: string;
  credit: string;
}

export interface MobileHomeCopy {
  aboutBody: string;
  contactIntro: string;
  experienceHeading: string;
  experienceIntroSuffix: string;
  heroIntro: string;
  initiallyOpenSkillGroups: string[];
  projectDescription: string;
  skillsIntro: string;
  workIntro: string;
}

export interface HomeCopy {
  about: AboutCopy;
  contact: ContactCopy;
  experience: ExperienceCopy;
  footer: FooterCopy;
  header: HeaderCopy;
  hero: HeroCopy;
  impactAriaLabel: string;
  mobile: MobileHomeCopy;
  skills: SkillsCopy;
  work: WorkCopy;
}

export interface ImpactMetric {
  context: string;
  id: string;
  label: string;
  value: string;
}

export interface LogoPairBrand {
  ariaLabel: string;
  kind: "logo-pair";
  primaryLogo: LocalImageAsset;
  secondaryLogo: LocalImageAsset;
}

export interface ClientLockupBrand {
  ariaLabel: string;
  clientLogo: LocalImageAsset;
  clientName: string;
  employerWordmark: string;
  kind: "client-lockup";
  qualifier: string;
  roleWatermarkPeriod: string;
  roleWatermarkPosition: string;
}

export interface TextBrand {
  ariaLabel: string;
  kind: "text";
  label: string;
}

export type EmployerBrand = LogoPairBrand | ClientLockupBrand | TextBrand;

export interface EmployerAwardHighlight {
  detail: string;
  label: string;
  schemaName: string;
  sourceResponsibility: string;
}

export interface EmployerAwardPresentation {
  eyebrow: string;
  highlights: EmployerAwardHighlight[];
  title: string;
}

export type EmployerDomainKind = "global-commerce" | "hospitality-platform";

export interface EmployerMarketFlag {
  /** ISO 3166-1 alpha-2 where possible; region/subdivision codes stay ISO-like. */
  code: string;
  /** Human-readable country or region name for accessible flag rendering. */
  label: string;
  emoji: string;
}

export interface EmployerMarketItem {
  detail?: string;
  flags: EmployerMarketFlag[];
  id: string;
  label: string;
}

export interface EmployerMarketGroup {
  detail?: string;
  id: string;
  items: EmployerMarketItem[];
  label: string;
}

export interface EmployerDomainPresentation {
  backgroundImage: LocalImageAsset;
  exposure: string[];
  exposureLabel: string;
  eyebrow: string;
  kind: EmployerDomainKind;
  marketLabel: string;
  marketGroups: EmployerMarketGroup[];
  mobileStatement: string;
  statement: string;
}

export interface EmployerPresentation {
  award?: EmployerAwardPresentation;
  brand: EmployerBrand;
  domain: EmployerDomainPresentation;
  id: string;
  metricIds: string[];
  parentOrganization?: string;
  schemaRelationship: EmployerSchemaRelationship;
  sourceCompany: string;
}

export interface SkillGroupDefinition {
  description: string;
  id: string;
  label: string;
}

export interface SkillPresentation {
  groupId: string;
  icon?: string;
  id: string;
  label: string;
  mark?: string;
  source: string;
}

export interface SkillPresentationConfig {
  groups: SkillGroupDefinition[];
  items: SkillPresentation[];
}

export interface PortfolioProject {
  description: string;
  eyebrow: string;
  id: string;
  image: LocalImageAsset;
  liveUrl: string;
  name: string;
  resumeProjectName: string;
  schema: {
    genre: string;
  };
  tech: string[];
}

export interface ResumeDownloadCopy {
  defaultFileName: string;
  studioExportFileName: string;
}

export interface PortfolioConfig {
  employers: EmployerPresentation[];
  home: HomeCopy;
  identity: PortfolioIdentity;
  metrics: ImpactMetric[];
  navigation: NavigationItem[];
  project: PortfolioProject;
  resumeDownloads: ResumeDownloadCopy;
  seo: PortfolioSeoConfig;
  skills: SkillPresentationConfig;
  version: number;
}

export interface ResumeContentSource {
  about?: {
    description?: string;
    title?: string;
  };
  education?: {
    degree?: string;
    field?: string;
    grade?: string;
    institution?: string;
    location?: string;
    period?: string;
  };
  experience?: Array<{
    company?: string;
    companyPeriod?: string;
    roles?: Array<{
      period?: string;
      position?: string;
      responsibilities?: string[];
    }>;
  }>;
  methodology?: string[];
  openSource?: {
    contributions?: string[];
    subtitle?: string;
    title?: string;
  };
  personalInfo?: {
    email?: string;
    github?: string;
    linkedin?: string;
    location?: string;
    name?: string;
    phone?: string;
    /** Resume-specific title; intentionally independent from identity.jobTitle. */
    title?: string;
    website?: string;
  };
  projects?: Array<{
    description?: string;
    details?: string[];
    name?: string;
  }>;
  skills?: string[];
  technicalExpertise?: string[];
  tools?: string[];
}

export interface PortfolioSkill {
  icon?: string;
  label: string;
  mark?: string;
  source: string;
}

export interface PortfolioSkillGroup extends SkillGroupDefinition {
  items: PortfolioSkill[];
  key: string;
}

export interface CareerDate {
  month: number;
  year: number;
}

export interface CareerTenure {
  months: number;
  years: number;
}

export interface DisplayPeriod {
  detail: string;
  end: string;
  start: string;
  startYear: string;
}

export type AssetExists = (publicPath: string) => boolean;

export interface PortfolioValidationOptions {
  assetExists?: AssetExists;
}
