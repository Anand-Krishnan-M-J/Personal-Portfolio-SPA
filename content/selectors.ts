import { parseCareerDate, parseCareerPeriod } from "./career";
import { portfolioConfig, resumeData } from "./runtime";
import type {
  CareerDate,
  CareerTenure,
  DisplayPeriod,
  EmployerMarketFlag,
  EmployerPresentation,
  PortfolioSkillGroup,
} from "./types";

export { resumeData };

export const navigation = portfolioConfig.navigation;
export const homepageCopy = portfolioConfig.home;
export const employerPresentations = portfolioConfig.employers;

export const impactMetrics = portfolioConfig.metrics.map(
  ({ context, ...metric }) => metric,
);
export const metricContext = portfolioConfig.metrics.map(
  (metric) => metric.context,
);

export const personalProject = {
  description: portfolioConfig.project.description,
  eyebrow: portfolioConfig.project.eyebrow,
  image: portfolioConfig.project.image.src,
  imageAlt: portfolioConfig.project.image.alt,
  live: portfolioConfig.project.liveUrl,
  name: portfolioConfig.project.name,
  tech: portfolioConfig.project.tech,
};

const sourceSkills = Array.from(
  new Set([
    ...(resumeData.technicalExpertise ?? []),
    ...(resumeData.skills ?? []),
    ...(resumeData.methodology ?? []),
    ...(resumeData.tools ?? []),
  ]),
);

const skillBySource = new Map(
  portfolioConfig.skills.items.map((skill) => [skill.source, skill]),
);

export const skillGroups: PortfolioSkillGroup[] =
  portfolioConfig.skills.groups.map((group) => ({
    ...group,
    key: group.id,
    items: sourceSkills
      .map((source) => skillBySource.get(source))
      .filter((skill): skill is NonNullable<typeof skill> =>
        Boolean(skill && skill.groupId === group.id),
      )
      .map((skill) => ({
        icon: skill.icon,
        label: skill.label,
        mark: skill.mark,
        source: skill.source,
      })),
  }));

export const totalSkillCount = skillGroups.reduce(
  (total, group) => total + group.items.length,
  0,
);

export const getEmployerPresentation = (
  companyName: string,
): EmployerPresentation | undefined =>
  employerPresentations.find(
    (employer) => employer.sourceCompany === companyName,
  );

export const getEmployerMetrics = (companyName: string) => {
  const employer = getEmployerPresentation(companyName);
  if (!employer) return [];
  const metricIds = new Set(employer.metricIds);
  return portfolioConfig.metrics.filter((metric) => metricIds.has(metric.id));
};

export const getEmployerAward = (companyName: string) =>
  getEmployerPresentation(companyName)?.award;

export const getEmployerMarketFlags = (
  companyName: string,
): EmployerMarketFlag[] => {
  const employer = getEmployerPresentation(companyName);
  if (!employer) return [];

  return Array.from(
    new Map(
      employer.domain.marketGroups
        .flatMap((group) => group.items)
        .flatMap((item) => item.flags)
        .map((flag) => [flag.code, flag] as const),
    ).values(),
  );
};

export { parseCareerDate };

export const getDisplayPeriod = (period: string): DisplayPeriod => {
  const [range, ...detailParts] = period.split(" · ");
  const [start = range, end = ""] = range.split(" - ");
  return {
    detail: detailParts.join(" · "),
    end,
    start,
    startYear: start.match(/\d{4}/)?.[0] ?? "",
  };
};

const careerStarts = (resumeData.experience ?? [])
  .flatMap((company) => company.roles ?? [])
  .map((role) => parseCareerPeriod(role.period ?? "")?.start ?? null)
  .filter((date): date is CareerDate => Boolean(date));

const firstCareerStart = careerStarts[0];
if (!firstCareerStart) {
  throw new Error(
    "Validated resume content must include at least one parseable career start date.",
  );
}

export const careerStart: CareerDate = careerStarts
  .slice(1)
  .reduce<CareerDate>(
    (earliest, candidate) =>
      candidate.year * 12 + candidate.month <
      earliest.year * 12 + earliest.month
        ? candidate
        : earliest,
    firstCareerStart,
  );

export const getCareerTenure = (today: Date): CareerTenure => {
  const totalMonths = Math.max(
    0,
    (today.getFullYear() - careerStart.year) * 12 +
      today.getMonth() -
      careerStart.month,
  );
  return {
    months: totalMonths % 12,
    years: Math.floor(totalMonths / 12),
  };
};

export const getRoundedCareerYears = ({ years, months }: CareerTenure) =>
  Math.max(0, Math.round(years + months / 12));

export const formatCareerTenure = (tenure: CareerTenure) => {
  const roundedYears = getRoundedCareerYears(tenure);
  return `${roundedYears} ${roundedYears === 1 ? "year" : "years"}`;
};

export const orderedExperience = [...(resumeData.experience ?? [])].sort(
  (left, right) => {
    const leftPeriod = getDisplayPeriod(left.companyPeriod ?? "");
    const rightPeriod = getDisplayPeriod(right.companyPeriod ?? "");
    const leftIsCurrent = leftPeriod.end.toLowerCase() === "present";
    const rightIsCurrent = rightPeriod.end.toLowerCase() === "present";
    if (leftIsCurrent !== rightIsCurrent) return leftIsCurrent ? -1 : 1;
    const leftStart = parseCareerDate(leftPeriod.start);
    const rightStart = parseCareerDate(rightPeriod.start);
    const leftValue = leftStart ? leftStart.year * 12 + leftStart.month : 0;
    const rightValue = rightStart ? rightStart.year * 12 + rightStart.month : 0;
    return rightValue - leftValue;
  },
);

const absoluteUrl = (path: string) =>
  new URL(
    path.replace(/^\/+/, ""),
    `${portfolioConfig.seo.siteUrl}/`,
  ).toString();

export const SITE_URL = portfolioConfig.seo.siteUrl.replace(/\/+$/, "");
export const SITE_HOME_URL = `${SITE_URL}/`;
export const SITE_NAME = portfolioConfig.seo.siteName;
export const SITE_TITLE = portfolioConfig.seo.title;
export const SITE_DESCRIPTION = portfolioConfig.seo.description;
export const SOCIAL_IMAGE_URL = absoluteUrl(
  portfolioConfig.seo.socialImage.src,
);
export const SOCIAL_IMAGE_ALT = portfolioConfig.seo.socialImage.alt;
export const PROFILE_IMAGE_URL = absoluteUrl(
  portfolioConfig.identity.portrait.src,
);
export const SOCIAL_PROFILE_URLS = [
  resumeData.personalInfo?.linkedin,
  resumeData.personalInfo?.github,
].filter((url): url is string => Boolean(url));

export const canonicalUrlForPath = (asPath: string) => {
  const pathname = asPath.split(/[?#]/)[0] || "/";
  const rootedPath = `/${pathname.replace(/^\/+/, "")}`;
  const normalizedPath =
    rootedPath === "/" ? rootedPath : rootedPath.replace(/\/+$/, "");
  return `${SITE_URL}${normalizedPath}`;
};

export const buildPortfolioStructuredData = () => {
  const personId = `${SITE_URL}/#person`;
  const profileImageId = `${SITE_URL}/#profile-image`;
  const websiteId = `${SITE_URL}/#website`;
  const profileId = `${SITE_URL}/#profile`;
  const projectId = `${SITE_URL}/#${portfolioConfig.project.id}`;
  const currentEmployer = portfolioConfig.employers.find(
    (employer) => employer.schemaRelationship === "current",
  );
  const formerEmployers = portfolioConfig.employers.filter(
    (employer) => employer.schemaRelationship === "former",
  );
  const knowsAbout = Array.from(
    new Set([...sourceSkills, ...portfolioConfig.seo.knowsAboutExtra]),
  );
  const educationInstitution = resumeData.education?.institution;
  const organizationId = (value: string) =>
    `${SITE_URL}/#organization-${value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")}`;
  const employerIdByName = new Map(
    portfolioConfig.employers.map((employer) => [
      employer.sourceCompany,
      organizationId(employer.sourceCompany),
    ]),
  );
  const parentOrganizations = Array.from(
    new Map(
      portfolioConfig.employers
        .filter((employer) => employer.parentOrganization)
        .map((employer) => {
          const name = employer.parentOrganization as string;
          const logo =
            employer.brand.kind === "logo-pair"
              ? absoluteUrl(employer.brand.secondaryLogo.src)
              : undefined;
          return [name, { logo, name }] as const;
        }),
    ).values(),
  );
  const parentOrganizationNodes = parentOrganizations.map(({ logo, name }) => ({
    "@id": organizationId(name),
    "@type": "Organization",
    ...(logo ? { logo } : {}),
    name,
  }));
  const employerOrganizationNodes = portfolioConfig.employers.map(
    (employer) => ({
      "@id": employerIdByName.get(employer.sourceCompany),
      "@type": "Organization",
      ...(employer.brand.kind === "logo-pair"
        ? { logo: absoluteUrl(employer.brand.primaryLogo.src) }
        : {}),
      name: employer.sourceCompany,
      ...(employer.parentOrganization
        ? {
            parentOrganization: {
              "@id": organizationId(employer.parentOrganization),
            },
          }
        : {}),
    }),
  );
  const awardTitles = portfolioConfig.employers.flatMap((employer) =>
    employer.award
      ? employer.award.highlights.map((highlight) => highlight.schemaName)
      : [],
  );
  const alumniOf = [
    ...formerEmployers.map((employer) => ({
      "@id": employerIdByName.get(employer.sourceCompany),
    })),
    ...(educationInstitution
      ? [
          {
            "@type": "CollegeOrUniversity",
            name: educationInstitution,
          },
        ]
      : []),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": profileImageId,
        "@type": "ImageObject",
        caption: `Portrait of ${portfolioConfig.identity.fullName}`,
        contentUrl: PROFILE_IMAGE_URL,
        height: portfolioConfig.identity.portrait.height,
        url: PROFILE_IMAGE_URL,
        width: portfolioConfig.identity.portrait.width,
      },
      ...parentOrganizationNodes,
      ...employerOrganizationNodes,
      {
        "@id": personId,
        "@type": "Person",
        alumniOf,
        alternateName: portfolioConfig.identity.displayName,
        ...(awardTitles.length ? { award: awardTitles } : {}),
        description: SITE_DESCRIPTION,
        ...(resumeData.personalInfo?.email
          ? { email: resumeData.personalInfo.email }
          : {}),
        familyName: portfolioConfig.seo.familyName,
        givenName: portfolioConfig.seo.givenName,
        image: { "@id": profileImageId },
        jobTitle: portfolioConfig.identity.jobTitle,
        knowsAbout,
        mainEntityOfPage: { "@id": profileId },
        name: portfolioConfig.identity.fullName,
        sameAs: SOCIAL_PROFILE_URLS,
        url: SITE_HOME_URL,
        ...(currentEmployer
          ? {
              worksFor: {
                "@id": employerIdByName.get(currentEmployer.sourceCompany),
              },
            }
          : {}),
      },
      {
        "@id": websiteId,
        "@type": "WebSite",
        alternateName: portfolioConfig.identity.fullName,
        creator: { "@id": personId },
        description: SITE_DESCRIPTION,
        inLanguage: portfolioConfig.seo.htmlLanguage,
        name: SITE_NAME,
        publisher: { "@id": personId },
        url: SITE_HOME_URL,
      },
      {
        "@id": projectId,
        "@type": "CreativeWork",
        creator: { "@id": personId },
        description: portfolioConfig.project.description,
        genre: portfolioConfig.project.schema.genre,
        image: absoluteUrl(portfolioConfig.project.image.src),
        isAccessibleForFree: true,
        keywords: portfolioConfig.project.tech.join(", "),
        name: portfolioConfig.project.name,
        publisher: { "@id": personId },
        url: portfolioConfig.project.liveUrl,
      },
      {
        "@id": profileId,
        "@type": "ProfilePage",
        about: { "@id": personId },
        description: SITE_DESCRIPTION,
        hasPart: { "@id": projectId },
        inLanguage: portfolioConfig.seo.htmlLanguage,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
        name: SITE_TITLE,
        primaryImageOfPage: { "@id": profileImageId },
        url: SITE_HOME_URL,
      },
    ],
  };
};

export const serializeStructuredData = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

export const portfolioStructuredData = buildPortfolioStructuredData();

export const defaultResumeFileName =
  portfolioConfig.resumeDownloads.defaultFileName;
export const studioExportFileName =
  portfolioConfig.resumeDownloads.studioExportFileName;
