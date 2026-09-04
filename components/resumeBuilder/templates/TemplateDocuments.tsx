import React from "react";
import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import {
  CVData,
  ResumeCustomization,
  ResumeDocumentProps,
  ResumeSectionId,
} from "../types";
import {
  getSectionSetting,
  normalizeCVData,
  normalizeCustomization,
  ResolvedDensity,
  resolveDensity,
  sanitizeResumeLinksForPdf,
} from "../resumeLayout";
import {
  BriefcaseIcon,
  EmailIcon,
  GitHubIcon,
  LinkedInIcon,
  LocationIcon,
  PhoneIcon,
  WebsiteIcon,
} from "../Icons";

export type ResumeLayout = "sidebar-left" | "sidebar-right" | "single";

export type TemplateSpec = {
  adaptivePageFill?: boolean;
  accent: string;
  background: string;
  baseFontSize?: number;
  boundedColumnRhythm?: boolean;
  card: string;
  companyCards?: boolean;
  condense?: boolean;
  contactIcons?: boolean;
  dense?: boolean;
  displayFont: "Helvetica" | "Times-Roman" | "Courier";
  fontBias?: number;
  fillStrength?: number;
  headerCard?: boolean;
  headingFont: "Helvetica-Bold" | "Times-Bold" | "Courier-Bold";
  ink: string;
  layout: ResumeLayout;
  line: string;
  muted: string;
  numbered?: boolean;
  pagePadding?: number;
  plain?: boolean;
  sectionCards?: boolean;
  sidebar: string;
  sidebarPanel?: boolean;
  spacingBias?: number;
  timeline?: boolean;
  uppercase?: boolean;
};

const specs: { [key: string]: TemplateSpec } = {
  signal: {
    adaptivePageFill: true,
    accent: "#2563eb",
    background: "#f8fafc",
    boundedColumnRhythm: true,
    card: "#ffffff",
    displayFont: "Helvetica",
    fillStrength: 0.9,
    headingFont: "Helvetica-Bold",
    ink: "#0f172a",
    layout: "sidebar-right",
    line: "#cbd5e1",
    muted: "#64748b",
    numbered: true,
    sidebar: "#eaf2ff",
    timeline: true,
    uppercase: true,
  },
  blueprint: {
    adaptivePageFill: true,
    accent: "#06b6d4",
    background: "#071827",
    boundedColumnRhythm: true,
    card: "#0d2437",
    companyCards: true,
    condense: true,
    dense: true,
    displayFont: "Courier",
    fillStrength: 0.78,
    headingFont: "Courier-Bold",
    ink: "#e6f7ff",
    layout: "sidebar-left",
    line: "#1f4b63",
    muted: "#90b6c7",
    numbered: true,
    sidebar: "#0a2032",
    uppercase: true,
  },
  swiss: {
    adaptivePageFill: true,
    accent: "#ef233c",
    background: "#ffffff",
    card: "#ffffff",
    condense: true,
    dense: true,
    displayFont: "Helvetica",
    fillStrength: 0.84,
    headingFont: "Helvetica-Bold",
    ink: "#111111",
    layout: "single",
    line: "#111111",
    muted: "#606060",
    numbered: true,
    sidebar: "#f4f4f2",
    uppercase: true,
  },
  executive: {
    adaptivePageFill: true,
    accent: "#9a6b2f",
    background: "#fbfaf7",
    card: "#ffffff",
    condense: true,
    dense: true,
    displayFont: "Times-Roman",
    fillStrength: 0.86,
    headingFont: "Times-Bold",
    ink: "#24211d",
    layout: "single",
    line: "#c9b99f",
    muted: "#71685c",
    sidebar: "#f1ede5",
  },
  terminal: {
    adaptivePageFill: true,
    accent: "#65f28b",
    background: "#0b0f14",
    boundedColumnRhythm: true,
    card: "#111821",
    companyCards: true,
    condense: true,
    dense: true,
    displayFont: "Courier",
    fillStrength: 0.78,
    headingFont: "Courier-Bold",
    ink: "#e5f7e9",
    layout: "sidebar-right",
    line: "#263241",
    muted: "#93a4b8",
    numbered: true,
    sidebar: "#0f1720",
  },
  editorial: {
    adaptivePageFill: true,
    accent: "#3155a6",
    background: "#f6f0e8",
    card: "#fffdf8",
    condense: true,
    dense: true,
    displayFont: "Times-Roman",
    fillStrength: 0.84,
    headingFont: "Times-Bold",
    ink: "#1e2430",
    layout: "single",
    line: "#9ba7bf",
    muted: "#667085",
    numbered: true,
    sidebar: "#e8edf8",
  },
  metric: {
    adaptivePageFill: true,
    accent: "#f97316",
    background: "#fffaf5",
    boundedColumnRhythm: true,
    card: "#ffffff",
    companyCards: true,
    condense: true,
    dense: true,
    displayFont: "Helvetica",
    fillStrength: 0.88,
    headingFont: "Helvetica-Bold",
    ink: "#201a17",
    layout: "sidebar-left",
    line: "#fed7aa",
    muted: "#7c6254",
    sidebar: "#ffeddc",
    uppercase: true,
  },
  aurora: {
    adaptivePageFill: true,
    accent: "#7c3aed",
    background: "#fbf8ff",
    boundedColumnRhythm: true,
    card: "#ffffff",
    displayFont: "Helvetica",
    fillStrength: 0.9,
    headingFont: "Helvetica-Bold",
    ink: "#20152d",
    layout: "sidebar-right",
    line: "#ddd0f5",
    muted: "#74647f",
    numbered: true,
    sidebar: "#f0e8ff",
    timeline: true,
  },
  ats: {
    adaptivePageFill: true,
    accent: "#111111",
    background: "#ffffff",
    card: "#ffffff",
    dense: true,
    displayFont: "Helvetica",
    fillStrength: 0.8,
    headingFont: "Helvetica-Bold",
    ink: "#111111",
    layout: "single",
    line: "#777777",
    muted: "#444444",
    plain: true,
    sidebar: "#ffffff",
  },
  compact: {
    adaptivePageFill: true,
    accent: "#0f766e",
    background: "#f4fbfa",
    boundedColumnRhythm: true,
    card: "#ffffff",
    companyCards: true,
    dense: true,
    displayFont: "Helvetica",
    fillStrength: 0.84,
    headingFont: "Helvetica-Bold",
    ink: "#102a27",
    layout: "sidebar-left",
    line: "#acd7d2",
    muted: "#53746f",
    numbered: true,
    sidebar: "#dff4f1",
    uppercase: true,
  },
};

const hasText = (value?: string): value is string =>
  Boolean(value && value.trim());

const hasList = (value?: string[]) =>
  Boolean(value && value.some((item) => hasText(item)));

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

const withProtocol = (value: string) =>
  /^(https?:|mailto:|tel:)/i.test(value) ? value : `https://${value}`;

const preserveWholeWords = (word: string) => [word];

export type ResumePageFit = {
  adjustedContentLoad: number;
  availableRoom: number;
  capacity: number;
  useAdaptiveFill: boolean;
  useStretchFill: boolean;
};

/**
 * Keeps visual fill proportional to real page capacity. A near-full resume
 * must not receive a mandatory boost because React-PDF will shrink flex
 * columns around their children and let text escape its cards.
 */
export const resolveResumePageFit = (
  spec: TemplateSpec,
  customization: ResumeCustomization,
  density: ResolvedDensity,
): ResumePageFit => {
  const capacity = customization.appearance.pageSize === "LETTER" ? 100 : 112;
  const adjustedContentLoad =
    density.contentScore *
    customization.appearance.fontScale *
    Math.sqrt(customization.appearance.lineSpacing) *
    Math.sqrt(customization.appearance.spacingScale) *
    (0.9 + customization.appearance.pageMargin * 0.1);
  const useAdaptiveFill = Boolean(
    spec.adaptivePageFill && adjustedContentLoad <= capacity,
  );
  // The content score deliberately errs on the side of early pagination. A
  // slightly wider visual range lets safe one-page documents use readable
  // type and rhythm without changing the hard overflow boundary above.
  const visualFillCapacity = capacity + (capacity === 112 ? 26 : 24);
  const availableRoom = useAdaptiveFill
    ? clamp(
        (visualFillCapacity - adjustedContentLoad) / (visualFillCapacity - 36),
        0,
        1,
      )
    : 0;

  return {
    adjustedContentLoad,
    availableRoom,
    capacity,
    useAdaptiveFill,
    useStretchFill: useAdaptiveFill && availableRoom >= 0.42,
  };
};

export const resolveResumeLayout = (
  spec: TemplateSpec,
  pageFit: ResumePageFit,
): ResumeLayout =>
  spec.layout !== "single" && pageFit.adjustedContentLoad > pageFit.capacity
    ? "single"
    : spec.layout;

const parseMonth = (value: string): Date | null => {
  const match = value
    .trim()
    .match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i);
  if (!match) return null;
  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  return new Date(
    Number(match[2]),
    monthNames.indexOf(match[1].toLowerCase()),
    1,
  );
};

const getExperienceLabel = (data: CVData) => {
  const starts: Date[] = [];
  data.experience?.forEach((company) => {
    company.roles?.forEach((role) => {
      const start = role.period
        ? parseMonth(role.period.split(" - ")[0])
        : null;
      if (start) starts.push(start);
    });
  });
  if (!starts.length) return data.personalInfo?.experience || "";
  const earliest = starts.reduce((first, date) =>
    date < first ? date : first,
  );
  const now = new Date();
  let years = now.getFullYear() - earliest.getFullYear();
  let months = now.getMonth() - earliest.getMonth();
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const roundedYears = Math.max(0, Math.round(years + months / 12));
  return `${roundedYears} ${roundedYears === 1 ? "year" : "years"}`;
};

const resolveFontPair = (
  spec: TemplateSpec,
  customization: ResumeCustomization,
): Pick<TemplateSpec, "displayFont" | "headingFont"> => {
  switch (customization.appearance.fontFamily) {
    case "helvetica":
      return { displayFont: "Helvetica", headingFont: "Helvetica-Bold" };
    case "times":
      return { displayFont: "Times-Roman", headingFont: "Times-Bold" };
    case "courier":
      return { displayFont: "Courier", headingFont: "Courier-Bold" };
    default:
      return {
        displayFont: spec.displayFont,
        headingFont: spec.headingFont,
      };
  }
};

const makeStyles = (
  spec: TemplateSpec,
  customization: ResumeCustomization,
  density: ResolvedDensity,
) => {
  const pageFit = resolveResumePageFit(spec, customization, density);
  const adaptivePageFill = pageFit.useAdaptiveFill;
  const multiColumnPageFill = adaptivePageFill && spec.layout !== "single";
  const singleColumnPageFill = adaptivePageFill && spec.layout === "single";
  const boundedColumnFill = Boolean(
    multiColumnPageFill && spec.boundedColumnRhythm,
  );
  const stretchMultiColumnFill = Boolean(
    multiColumnPageFill && pageFit.useStretchFill,
  );
  const availableRoom = pageFit.availableRoom;
  const fillStrength = spec.fillStrength || 1;
  const fillSpacingBoost = singleColumnPageFill
    ? 1 + availableRoom * 0.79 * fillStrength
    : boundedColumnFill
      ? 1 + availableRoom * 0.7 * fillStrength
      : multiColumnPageFill
        ? 1 + availableRoom * 0.53 * fillStrength
        : 1;
  const fillFontBoost = singleColumnPageFill
    ? 1 + availableRoom * 0.23 * fillStrength
    : boundedColumnFill
      ? 1 + availableRoom * 0.19 * fillStrength
      : multiColumnPageFill
        ? 1 + availableRoom * 0.1 * fillStrength
        : 1;
  const fillLineHeightBoost = singleColumnPageFill
    ? availableRoom * 0.21 * fillStrength
    : boundedColumnFill
      ? availableRoom * 0.19 * fillStrength
      : multiColumnPageFill
        ? availableRoom * 0.18 * fillStrength
        : 0;
  const templateSpacing =
    spec.spacingBias || (spec.condense ? 0.88 : spec.dense ? 0.94 : 1);
  const spacing = density.spacingFactor * templateSpacing * fillSpacingBoost;
  const compactMarginFactor =
    density.label === "compact"
      ? 0.88
      : density.label === "balanced"
        ? 0.95
        : 1;
  const basePadding =
    spec.pagePadding || (spec.plain ? 30 : spec.dense ? 22 : 25);
  const pagePadding = clamp(
    basePadding * customization.appearance.pageMargin * compactMarginFactor,
    17,
    42,
  );
  const baseSize = clamp(
    (spec.baseFontSize || (spec.dense ? 7.2 : 7.9)) *
      density.fontFactor *
      (spec.fontBias || 1) *
      fillFontBoost,
    6.8,
    10.2,
  );
  const pillFontSize = clamp(baseSize * 0.82, 5.7, 7.2);
  const space = (value: number, minimum = 0.75) =>
    Math.max(minimum, value * spacing);
  const hasSectionCards = Boolean(spec.sectionCards && !spec.plain);
  const hasHeaderCard = Boolean(spec.headerCard && !spec.plain);
  const hasSidebarPanel = spec.sidebarPanel !== false && !spec.plain;
  const bodyJustification =
    stretchMultiColumnFill && !boundedColumnFill
      ? "space-between"
      : "flex-start";
  const bodyLineHeight =
    ((density.label === "compact" ? 1.28 : 1.36) + fillLineHeightBoost) *
    customization.appearance.lineSpacing;
  const textLineHeight = (compact: number, relaxed: number) =>
    ((density.label === "compact" ? compact : relaxed) + fillLineHeightBoost) *
    customization.appearance.lineSpacing;

  return StyleSheet.create({
    page: {
      backgroundColor: spec.background,
      color: spec.ink,
      fontFamily: spec.displayFont,
      fontSize: baseSize,
      lineHeight: bodyLineHeight,
      paddingBottom: pagePadding + 9,
      paddingHorizontal: pagePadding,
      paddingTop: pagePadding,
    },
    header: {
      backgroundColor: hasHeaderCard ? spec.card : "transparent",
      borderColor: hasHeaderCard ? spec.line : "transparent",
      borderRadius: hasHeaderCard ? 6 : 0.01,
      borderWidth: hasHeaderCard ? 0.8 : 0.01,
      borderBottomColor: spec.accent,
      borderBottomWidth: spec.plain ? 1 : hasHeaderCard ? 2 : 3,
      marginBottom: space(spec.dense ? 9 : 15),
      padding: hasHeaderCard ? space(10) : 0,
      paddingBottom: hasHeaderCard ? space(9) : space(spec.dense ? 7 : 11),
    },
    name: {
      color: spec.ink,
      fontFamily: spec.headingFont,
      fontSize: clamp(
        baseSize * (spec.plain ? 2.55 : spec.layout === "single" ? 3.25 : 2.95),
        18,
        30,
      ),
      letterSpacing: spec.uppercase ? 0.5 : 0,
      lineHeight: 1.05,
      textTransform: spec.uppercase ? "uppercase" : "none",
    },
    role: {
      color: spec.accent,
      fontFamily: spec.headingFont,
      fontSize: clamp(baseSize * 1.22, 8.2, 11),
      lineHeight: 1.1,
      marginTop: space(spec.dense ? 2.5 : 4),
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: space(spec.dense ? 5 : 7),
    },
    contactItem: {
      color: spec.muted,
      fontSize: clamp(baseSize * 0.86, 6.4, 8),
      lineHeight: 1.2,
      marginRight: space(spec.dense ? 8 : 11),
      marginTop: space(spec.dense ? 1 : 2),
      textDecoration: "none",
    },
    contactIconItem: {
      alignItems: "center",
      flexDirection: "row",
      marginRight: space(spec.dense ? 7 : 9),
      marginTop: space(spec.dense ? 1 : 2),
      textDecoration: "none",
    },
    contactIcon: {
      alignItems: "center",
      flexShrink: 0,
      justifyContent: "center",
      marginRight: space(2.25),
      width: clamp(baseSize * 0.92, 6.8, 8.5),
    },
    contactIconLabel: {
      color: spec.muted,
      fontSize: clamp(baseSize * 0.84, 6.3, 7.9),
      lineHeight: 1.2,
    },
    columns: {
      alignItems: stretchMultiColumnFill ? "stretch" : "flex-start",
      flexDirection: "row",
      flexGrow: stretchMultiColumnFill ? 1 : 0,
    },
    mainColumn: {
      alignSelf: stretchMultiColumnFill ? "stretch" : "flex-start",
      borderBottomColor: stretchMultiColumnFill ? spec.line : "transparent",
      borderBottomWidth: stretchMultiColumnFill ? 0.7 : 0,
      flexGrow: 1,
      flexShrink: 1,
      justifyContent: bodyJustification,
      width: "67%",
    },
    sidebarColumn: {
      alignSelf: stretchMultiColumnFill ? "stretch" : "flex-start",
      borderBottomColor: stretchMultiColumnFill ? spec.line : "transparent",
      borderBottomWidth: stretchMultiColumnFill ? 0.7 : 0,
      flexShrink: 0,
      width: "30%",
    },
    sidebar: {
      backgroundColor: hasSidebarPanel ? spec.sidebar : "transparent",
      borderColor: hasSidebarPanel ? spec.line : "transparent",
      borderRadius: hasSidebarPanel ? 5 : 0.01,
      borderWidth: hasSidebarPanel ? 0.7 : 0.01,
      flexGrow: stretchMultiColumnFill ? 1 : 0,
      flexShrink: stretchMultiColumnFill ? 1 : 0,
      justifyContent: bodyJustification,
      padding: hasSidebarPanel ? space(spec.dense ? 8 : 11) : 0,
      width: "100%",
    },
    leftGutter: {
      marginLeft: space(spec.dense ? 10 : 13),
    },
    rightGutter: {
      marginRight: space(spec.dense ? 10 : 13),
    },
    singleSupport: {
      marginTop: space(2),
    },
    section: {
      backgroundColor: hasSectionCards ? spec.card : "transparent",
      borderColor: hasSectionCards ? spec.line : "transparent",
      borderRadius: hasSectionCards ? 6 : 0.01,
      borderWidth: hasSectionCards ? 0.8 : 0.01,
      flexShrink: 0,
      marginBottom: space(spec.dense ? 7 : 11),
      padding: hasSectionCards ? space(spec.dense ? 7 : 9) : 0,
    },
    sectionTitle: {
      borderBottomColor: spec.line,
      borderBottomWidth: spec.plain ? 0.75 : 1,
      color: spec.accent,
      fontFamily: spec.headingFont,
      fontSize: clamp(baseSize * 1.08, 7.6, 10),
      letterSpacing: spec.uppercase || spec.numbered ? 0.8 : 0.2,
      lineHeight: 1.1,
      marginBottom: space(spec.dense ? 4.5 : 6.5),
      paddingBottom: space(spec.dense ? 2 : 3),
      textTransform: spec.uppercase ? "uppercase" : "none",
    },
    summary: {
      color: spec.ink,
      fontSize: baseSize,
      lineHeight: textLineHeight(1.32, 1.44),
    },
    experienceItem: {
      backgroundColor: spec.companyCards ? spec.card : "transparent",
      borderColor: spec.companyCards ? spec.line : "transparent",
      borderRadius: spec.companyCards ? 4 : 0.01,
      borderWidth: spec.companyCards ? 0.8 : 0.01,
      borderLeftColor: spec.timeline ? spec.accent : spec.line,
      borderLeftWidth: spec.timeline ? 2.5 : spec.companyCards ? 0.8 : 0.01,
      flexShrink: 0,
      marginBottom: space(spec.dense ? 6 : 9),
      padding: spec.companyCards ? space(spec.dense ? 6 : 8) : 0,
      paddingLeft: spec.timeline
        ? space(9)
        : spec.companyCards
          ? space(spec.dense ? 6 : 8)
          : 0,
    },
    companyRow: {
      alignItems: "flex-start",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: space(2),
    },
    company: {
      color: spec.ink,
      fontFamily: spec.headingFont,
      fontSize: clamp(baseSize * 1.3, 8.8, 11.5),
      lineHeight: 1.15,
      width: "58%",
    },
    companyPeriod: {
      color: spec.muted,
      fontSize: clamp(baseSize * 0.82, 6.3, 7.8),
      lineHeight: 1.2,
      textAlign: "right",
      width: "40%",
    },
    roleItem: {
      flexShrink: 0,
      marginBottom: space(2),
    },
    roleRow: {
      alignItems: "baseline",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: space(spec.dense ? 2 : 3),
      marginTop: space(spec.dense ? 2 : 3),
    },
    position: {
      color: spec.accent,
      fontFamily: spec.headingFont,
      fontSize: clamp(baseSize * 1.02, 7.2, 9),
      lineHeight: 1.15,
      width: "58%",
    },
    period: {
      color: spec.muted,
      fontSize: clamp(baseSize * 0.82, 6.3, 7.8),
      lineHeight: 1.2,
      textAlign: "right",
      width: "40%",
    },
    bullet: {
      color: spec.ink,
      fontSize: baseSize,
      lineHeight: textLineHeight(1.26, 1.34),
      marginBottom: space(spec.dense ? 1.6 : 2.7),
      paddingLeft: space(spec.dense ? 6 : 8),
      textIndent: -space(spec.dense ? 6 : 8),
    },
    pills: {
      columnGap: space(spec.dense ? 2.5 : 4),
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: space(spec.dense ? 2.5 : 4),
    },
    pill: {
      alignItems: "center",
      backgroundColor: spec.plain ? "transparent" : spec.card,
      borderColor: spec.line,
      borderRadius: spec.plain ? 0.01 : 8,
      borderWidth: spec.plain ? 0.01 : 0.7,
      flexDirection: "row",
      flexShrink: 0,
      justifyContent: "center",
      maxWidth: "100%",
      minHeight: pillFontSize * (spec.dense ? 1.65 : 1.8),
      paddingHorizontal: spec.plain ? 0 : space(spec.dense ? 3.5 : 5),
    },
    pillText: {
      color: spec.ink,
      fontSize: pillFontSize,
      lineHeight: 1.05,
      textAlign: "center",
    },
    plainList: {
      color: spec.ink,
      fontSize: baseSize,
      lineHeight: textLineHeight(1.3, 1.42),
    },
    educationTitle: {
      color: spec.ink,
      fontFamily: spec.headingFont,
      fontSize: clamp(baseSize * 1.05, 7.4, 9),
      lineHeight: 1.15,
      marginBottom: space(spec.dense ? 1 : 2),
    },
    small: {
      color: spec.muted,
      fontSize: clamp(baseSize * 0.84, 6.3, 8),
      lineHeight: 1.25,
      marginBottom: space(spec.dense ? 1 : 2),
    },
    projectItem: {
      flexShrink: 0,
      marginBottom: space(spec.dense ? 5 : 8),
    },
    projectTitle: {
      color: spec.ink,
      fontFamily: spec.headingFont,
      fontSize: clamp(baseSize * 1.05, 7.4, 9),
      lineHeight: 1.15,
      marginBottom: space(spec.dense ? 1 : 2),
    },
    projectDescription: {
      color: spec.muted,
      fontSize: clamp(baseSize * 0.86, 6.3, 8),
      lineHeight: textLineHeight(1.25, 1.34),
      marginBottom: space(spec.dense ? 2 : 3),
    },
    footer: {
      bottom: Math.max(9, pagePadding * 0.4),
      color: spec.muted,
      fontSize: clamp(baseSize * 0.74, 6.2, 7),
      left: pagePadding,
      letterSpacing: 0.35,
      position: "absolute",
      right: pagePadding,
      textAlign: "right",
    },
  });
};

type ResumeStyles = ReturnType<typeof makeStyles>;

type RenderProps = {
  customization: ResumeCustomization;
  data: CVData;
  spec: TemplateSpec;
  styles: ResumeStyles;
};

const Section = ({
  children,
  id,
  index,
  spec,
  styles,
  customization,
}: RenderProps & {
  children: React.ReactNode;
  id: ResumeSectionId;
  index: number;
}) => {
  const setting = getSectionSetting(customization, id);
  return (
    <View style={styles.section}>
      <View minPresenceAhead={36}>
        <Text style={styles.sectionTitle}>
          {spec.numbered ? `${String(index).padStart(2, "0")} / ` : ""}
          {setting.label}
        </Text>
      </View>
      {children}
    </View>
  );
};

type HeaderContactItem = {
  color: string;
  href?: string;
  icon: React.ComponentType<{ color?: string; size?: number }>;
  label: string;
};

const Header = ({ data, spec, styles }: RenderProps) => {
  const info = data.personalInfo || {};
  const experienceLabel = getExperienceLabel(data);
  const links = [
    info.email
      ? {
          color: spec.accent,
          href: `mailto:${info.email}`,
          icon: EmailIcon,
          label: info.email,
        }
      : undefined,
    info.phone
      ? {
          color: spec.accent,
          href: `tel:${info.phone}`,
          icon: PhoneIcon,
          label: info.phone,
        }
      : undefined,
    info.location
      ? {
          color: spec.accent,
          icon: LocationIcon,
          label: info.location,
        }
      : undefined,
    info.linkedin
      ? {
          color: "#0077b5",
          href: withProtocol(info.linkedin),
          icon: LinkedInIcon,
          label: "LinkedIn",
        }
      : undefined,
    info.github
      ? {
          color: spec.ink,
          href: withProtocol(info.github),
          icon: GitHubIcon,
          label: "GitHub",
        }
      : undefined,
    info.website
      ? {
          color: spec.accent,
          href: withProtocol(info.website),
          icon: WebsiteIcon,
          label: info.website.replace(/^https?:\/\//, ""),
        }
      : undefined,
  ].filter(Boolean) as HeaderContactItem[];

  if (hasText(experienceLabel)) {
    links.push({
      color: spec.accent,
      icon: BriefcaseIcon,
      label: `${experienceLabel} experience`,
    });
  }

  return (
    <View minPresenceAhead={72} style={styles.header}>
      <Text style={styles.name}>
        {hasText(info.name) ? info.name.trim() : "Your Name"}
      </Text>
      {hasText(info.title) && <Text style={styles.role}>{info.title}</Text>}
      <View style={styles.contactRow}>
        {links.map((item) => {
          if (!spec.contactIcons) {
            return item.href ? (
              <Link
                key={`${item.label}-${item.href}`}
                src={item.href}
                style={styles.contactItem}
              >
                {item.label}
              </Link>
            ) : (
              <Text key={item.label} style={styles.contactItem}>
                {item.label}
              </Text>
            );
          }

          const Icon = item.icon;
          const content = (
            <>
              <View style={styles.contactIcon}>
                <Icon color={item.color} size={7.4} />
              </View>
              <Text style={styles.contactIconLabel}>{item.label}</Text>
            </>
          );

          return item.href ? (
            <Link
              key={`${item.label}-${item.href}`}
              src={item.href}
              style={styles.contactIconItem}
            >
              {content}
            </Link>
          ) : (
            <View key={item.label} style={styles.contactIconItem}>
              {content}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const Experience = (props: RenderProps & { index: number }) => {
  const { data, spec, styles } = props;
  const companies = (data.experience || []).filter(
    (company) =>
      hasText(company.company) ||
      hasText(company.companyPeriod) ||
      Boolean(company.roles?.length),
  );
  if (!companies.length) return null;

  return (
    <Section {...props} id="experience">
      {companies.map((company, companyIndex) => (
        <View
          key={`${company.company}-${companyIndex}`}
          style={styles.experienceItem}
        >
          <View minPresenceAhead={44} style={styles.companyRow}>
            <Text
              hyphenationCallback={preserveWholeWords}
              style={styles.company}
            >
              {company.company}
            </Text>
            <Text
              hyphenationCallback={preserveWholeWords}
              style={styles.companyPeriod}
            >
              {company.companyPeriod}
            </Text>
          </View>
          {company.roles?.map((role, roleIndex) => (
            <View key={`${role.position}-${roleIndex}`} style={styles.roleItem}>
              <View minPresenceAhead={30} style={styles.roleRow}>
                <Text
                  hyphenationCallback={preserveWholeWords}
                  style={styles.position}
                >
                  {role.position}
                </Text>
                <Text
                  hyphenationCallback={preserveWholeWords}
                  style={styles.period}
                >
                  {role.period}
                </Text>
              </View>
              {role.responsibilities
                ?.filter(hasText)
                .map((responsibility, responsibilityIndex) => (
                  <Text
                    hyphenationCallback={preserveWholeWords}
                    key={`${responsibilityIndex}-${responsibility.slice(0, 12)}`}
                    orphans={2}
                    style={styles.bullet}
                    widows={2}
                  >
                    {spec.plain ? "-" : "•"} {responsibility}
                  </Text>
                ))}
            </View>
          ))}
        </View>
      ))}
    </Section>
  );
};

const SkillGroup = ({
  id,
  index,
  items,
  ...props
}: RenderProps & {
  id: "technicalExpertise" | "skills" | "methodology" | "tools";
  index: number;
  items?: string[];
}) => {
  const filteredItems = (items || []).filter(hasText);
  if (!filteredItems.length) return null;
  return (
    <Section {...props} id={id} index={index}>
      {props.spec.plain ? (
        <Text
          hyphenationCallback={preserveWholeWords}
          orphans={2}
          style={props.styles.plainList}
          widows={2}
        >
          {filteredItems.join(", ")}
        </Text>
      ) : (
        <View style={props.styles.pills}>
          {filteredItems.map((item, itemIndex) => (
            <View
              key={`${item}-${itemIndex}`}
              style={props.styles.pill}
              wrap={false}
            >
              <Text
                hyphenationCallback={preserveWholeWords}
                style={props.styles.pillText}
              >
                {item}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Section>
  );
};

const Summary = (props: RenderProps & { index: number }) => {
  if (!hasText(props.data.about?.description)) return null;
  return (
    <Section {...props} id="profile">
      <Text
        hyphenationCallback={preserveWholeWords}
        orphans={2}
        style={props.styles.summary}
        widows={2}
      >
        {props.data.about?.description}
      </Text>
    </Section>
  );
};

const Education = (props: RenderProps & { index: number }) => {
  const education = props.data.education;
  if (
    !education ||
    ![
      education.degree,
      education.field,
      education.institution,
      education.location,
      education.period,
      education.grade,
    ].some(hasText)
  )
    return null;

  return (
    <Section {...props} id="education">
      {hasText(education.degree) && (
        <Text style={props.styles.educationTitle}>{education.degree}</Text>
      )}
      {hasText(education.field) && (
        <Text
          hyphenationCallback={preserveWholeWords}
          style={props.styles.small}
        >
          {education.field}
        </Text>
      )}
      {(hasText(education.institution) || hasText(education.location)) && (
        <Text
          hyphenationCallback={preserveWholeWords}
          style={props.styles.small}
        >
          {[education.institution, education.location]
            .filter(hasText)
            .join(" / ")}
        </Text>
      )}
      {(hasText(education.period) || hasText(education.grade)) && (
        <Text
          hyphenationCallback={preserveWholeWords}
          style={props.styles.small}
        >
          {[education.period, education.grade].filter(hasText).join(" / ")}
        </Text>
      )}
    </Section>
  );
};

const OpenSource = (props: RenderProps & { index: number }) => {
  const openSource = props.data.openSource;
  if (
    !openSource ||
    (!hasText(openSource.title) &&
      !hasText(openSource.subtitle) &&
      !hasList(openSource.contributions))
  )
    return null;

  return (
    <Section {...props} id="openSource">
      {(hasText(openSource.title) || hasText(openSource.subtitle)) && (
        <View minPresenceAhead={30}>
          <Text style={props.styles.projectTitle}>
            {[openSource.title, openSource.subtitle].filter(hasText).join(" ")}
          </Text>
        </View>
      )}
      {openSource.contributions?.filter(hasText).map((item, itemIndex) => (
        <Text
          hyphenationCallback={preserveWholeWords}
          key={`${itemIndex}-${item.slice(0, 12)}`}
          orphans={2}
          style={props.styles.bullet}
          widows={2}
        >
          {props.spec.plain ? "-" : "•"} {item}
        </Text>
      ))}
    </Section>
  );
};

const Projects = (props: RenderProps & { index: number }) => {
  const projects = (props.data.projects || []).filter(
    (project) =>
      hasText(project.name) ||
      hasText(project.description) ||
      hasList(project.details),
  );
  if (!projects.length) return null;

  return (
    <Section {...props} id="projects">
      {projects.map((project, projectIndex) => (
        <View
          key={`${project.name}-${projectIndex}`}
          style={props.styles.projectItem}
        >
          <View minPresenceAhead={34}>
            {hasText(project.name) && (
              <Text style={props.styles.projectTitle}>{project.name}</Text>
            )}
            {hasText(project.description) && (
              <Text
                hyphenationCallback={preserveWholeWords}
                orphans={2}
                style={props.styles.projectDescription}
                widows={2}
              >
                {project.description}
              </Text>
            )}
          </View>
          {project.details?.filter(hasText).map((detail, detailIndex) => (
            <Text
              hyphenationCallback={preserveWholeWords}
              key={`${detailIndex}-${detail.slice(0, 12)}`}
              orphans={2}
              style={props.styles.bullet}
              widows={2}
            >
              {props.spec.plain ? "-" : "•"} {detail}
            </Text>
          ))}
        </View>
      ))}
    </Section>
  );
};

const sectionHasContent = (data: CVData, id: ResumeSectionId) => {
  switch (id) {
    case "profile":
      return hasText(data.about?.description);
    case "experience":
      return Boolean(
        data.experience?.some(
          (company) =>
            hasText(company.company) ||
            hasText(company.companyPeriod) ||
            Boolean(company.roles?.length),
        ),
      );
    case "technicalExpertise":
      return hasList(data.technicalExpertise);
    case "skills":
      return hasList(data.skills);
    case "methodology":
      return hasList(data.methodology);
    case "tools":
      return hasList(data.tools);
    case "openSource":
      return Boolean(
        hasText(data.openSource?.title) ||
        hasText(data.openSource?.subtitle) ||
        hasList(data.openSource?.contributions),
      );
    case "education":
      return Boolean(
        data.education &&
        [
          data.education.degree,
          data.education.field,
          data.education.institution,
          data.education.location,
          data.education.period,
          data.education.grade,
        ].some(hasText),
      );
    case "projects":
      return Boolean(
        data.projects?.some(
          (project) =>
            hasText(project.name) ||
            hasText(project.description) ||
            hasList(project.details),
        ),
      );
  }
};

const SectionById = ({
  id,
  index,
  ...props
}: RenderProps & { id: ResumeSectionId; index: number }) => {
  switch (id) {
    case "profile":
      return <Summary {...props} index={index} />;
    case "experience":
      return <Experience {...props} index={index} />;
    case "technicalExpertise":
      return (
        <SkillGroup
          {...props}
          id={id}
          index={index}
          items={props.data.technicalExpertise}
        />
      );
    case "skills":
      return (
        <SkillGroup
          {...props}
          id={id}
          index={index}
          items={props.data.skills}
        />
      );
    case "methodology":
      return (
        <SkillGroup
          {...props}
          id={id}
          index={index}
          items={props.data.methodology}
        />
      );
    case "tools":
      return (
        <SkillGroup {...props} id={id} index={index} items={props.data.tools} />
      );
    case "openSource":
      return <OpenSource {...props} index={index} />;
    case "education":
      return <Education {...props} index={index} />;
    case "projects":
      return <Projects {...props} index={index} />;
  }
};

const SectionList = ({
  allIds,
  ids,
  ...props
}: RenderProps & { allIds: ResumeSectionId[]; ids: ResumeSectionId[] }) => (
  <>
    {ids.map((id) => (
      <SectionById {...props} id={id} index={allIds.indexOf(id) + 1} key={id} />
    ))}
  </>
);

const ResumeBody = (props: RenderProps) => {
  const allIds = props.customization.sections
    .map((section) => getSectionSetting(props.customization, section.id))
    .filter(
      (setting) => setting.visible && sectionHasContent(props.data, setting.id),
    )
    .map((setting) => setting.id);
  const mainIds = allIds.filter(
    (id) => getSectionSetting(props.customization, id).placement === "main",
  );
  const sidebarIds = allIds.filter(
    (id) => getSectionSetting(props.customization, id).placement === "sidebar",
  );

  if (props.spec.layout === "single") {
    return (
      <View>
        <SectionList {...props} allIds={allIds} ids={allIds} />
      </View>
    );
  }

  if (!mainIds.length || !sidebarIds.length) {
    return (
      <View>
        <SectionList {...props} allIds={allIds} ids={allIds} />
      </View>
    );
  }

  const sidebar = (
    <View style={props.styles.sidebar}>
      <SectionList {...props} allIds={allIds} ids={sidebarIds} />
    </View>
  );
  const main = (
    <View style={props.styles.mainColumn}>
      <SectionList {...props} allIds={allIds} ids={mainIds} />
    </View>
  );

  return (
    <View style={props.styles.columns}>
      {props.spec.layout === "sidebar-left" && (
        <View style={[props.styles.sidebarColumn, props.styles.rightGutter]}>
          {sidebar}
        </View>
      )}
      {main}
      {props.spec.layout === "sidebar-right" && (
        <View style={[props.styles.sidebarColumn, props.styles.leftGutter]}>
          {sidebar}
        </View>
      )}
    </View>
  );
};

export const StyledResumeDocument = ({
  customization,
  data,
  spec,
}: ResumeDocumentProps & { spec: TemplateSpec }) => {
  const normalizedData = sanitizeResumeLinksForPdf(normalizeCVData(data));
  const normalizedCustomization = normalizeCustomization(customization);
  const density = resolveDensity(normalizedData, normalizedCustomization);
  const fontPair = resolveFontPair(spec, normalizedCustomization);
  const pageFit = resolveResumePageFit(spec, normalizedCustomization, density);
  const resolvedSpec: TemplateSpec = {
    ...spec,
    accent: normalizedCustomization.appearance.useTemplateAccent
      ? spec.accent
      : normalizedCustomization.appearance.accent,
    displayFont: fontPair.displayFont,
    headingFont: fontPair.headingFont,
    // Two-column flex rows are one-page compositions. If an edited resume no
    // longer fits, use normal document flow so React-PDF can add pages instead
    // of squeezing or clipping either column.
    layout: resolveResumeLayout(spec, pageFit),
  };
  const styles = makeStyles(resolvedSpec, normalizedCustomization, density);
  const renderProps: RenderProps = {
    customization: normalizedCustomization,
    data: normalizedData,
    spec: resolvedSpec,
    styles,
  };
  const name = normalizedData.personalInfo?.name?.trim();

  return (
    <Document
      author={name || undefined}
      subject={name ? `${name} professional resume` : "Professional resume"}
      title={name ? `${name} - Resume` : "Professional Resume"}
    >
      <Page
        size={normalizedCustomization.appearance.pageSize}
        style={styles.page}
        wrap
      >
        <Header {...renderProps} />
        <ResumeBody {...renderProps} />
        <Text
          fixed
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} of ${totalPages}`
          }
          style={styles.footer}
        />
      </Page>
    </Document>
  );
};

export const SignalTimelineDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={specs.signal} />
);

export const SystemsBlueprintDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={specs.blueprint} />
);

export const SwissGridDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={specs.swiss} />
);

export const ExecutiveSlateDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={specs.executive} />
);

export const TerminalCraftDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={specs.terminal} />
);

export const EditorialEngineerDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={specs.editorial} />
);

export const MetricImpactDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={specs.metric} />
);

export const AuroraColumnsDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={specs.aurora} />
);

export const MonochromeAtsDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={specs.ats} />
);

export const CompactOnePageDocument = (props: ResumeDocumentProps) => (
  <StyledResumeDocument {...props} spec={specs.compact} />
);
