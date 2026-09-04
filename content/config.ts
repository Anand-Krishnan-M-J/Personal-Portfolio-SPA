import configSource from "./portfolio.config.json";
import { parseCareerPeriod } from "./career";
import type {
  PortfolioConfig,
  PortfolioSectionId,
  PortfolioValidationOptions,
  ResumeContentSource,
  SocialImageMimeType,
} from "./types";

type UnknownRecord = Record<string, unknown>;

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MARKET_FLAG_CODE_PATTERN = /^(?:[A-Z]{2,3})(?:-[A-Z0-9]{2,4})?$/;
const LOCAL_ASSET_PATTERN =
  /^\/(?!\/)(?:[a-zA-Z0-9@._-]+\/)*[a-zA-Z0-9@._-]+\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i;
const SOCIAL_IMAGE_EXTENSIONS: Record<SocialImageMimeType, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
};
const SECTION_IDS = new Set<PortfolioSectionId>([
  "experience",
  "work",
  "about",
  "skills",
  "contact",
]);

export class ContentConfigValidationError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(`Portfolio content is invalid:\n- ${issues.join("\n- ")}`);
    this.name = "ContentConfigValidationError";
    this.issues = issues;
  }
}

const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const recordAt = (
  value: unknown,
  path: string,
  issues: string[],
): UnknownRecord => {
  if (isRecord(value)) return value;
  issues.push(`${path} must be an object.`);
  return {};
};

const arrayAt = (value: unknown, path: string, issues: string[]): unknown[] => {
  if (Array.isArray(value)) return value;
  issues.push(`${path} must be an array.`);
  return [];
};

const requiredString = (
  record: UnknownRecord,
  key: string,
  path: string,
  issues: string[],
  allowEmpty = false,
) => {
  const value = record[key];
  if (typeof value !== "string" || (!allowEmpty && !value.trim())) {
    issues.push(
      `${path}.${key} must be ${allowEmpty ? "a string" : "a non-empty string"}.`,
    );
    return "";
  }
  return value;
};

const optionalString = (
  record: UnknownRecord,
  key: string,
  path: string,
  issues: string[],
) => {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string" || !value.trim()) {
    issues.push(`${path}.${key} must be a non-empty string when provided.`);
    return undefined;
  }
  return value;
};

const validatePlainDisplayText = (
  value: string,
  path: string,
  issues: string[],
  maxLength: number,
) => {
  const hasUnsafeCharacter = Array.from(value).some((character) => {
    const codePoint = character.codePointAt(0) ?? 0;
    return (
      codePoint < 32 ||
      codePoint === 127 ||
      character === "<" ||
      character === ">"
    );
  });
  if (value && (value.length > maxLength || hasUnsafeCharacter)) {
    issues.push(
      `${path} must be plain display text of at most ${maxLength} characters.`,
    );
  }
};

const safeDisplayText = (
  record: UnknownRecord,
  key: string,
  path: string,
  issues: string[],
  maxLength = 120,
) => {
  const value = requiredString(record, key, path, issues);
  validatePlainDisplayText(value, `${path}.${key}`, issues, maxLength);
  return value;
};

const positiveNumber = (
  record: UnknownRecord,
  key: string,
  path: string,
  issues: string[],
) => {
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    issues.push(`${path}.${key} must be a positive number.`);
    return 0;
  }
  return value;
};

const stringArray = (
  value: unknown,
  path: string,
  issues: string[],
  allowEmpty = false,
) => {
  const items = arrayAt(value, path, issues);
  if (!allowEmpty && items.length === 0)
    issues.push(`${path} cannot be empty.`);
  items.forEach((item, index) => {
    if (typeof item !== "string" || !item.trim()) {
      issues.push(`${path}[${index}] must be a non-empty string.`);
    }
  });
  return items.filter(
    (item): item is string => typeof item === "string" && Boolean(item.trim()),
  );
};

const validateId = (value: string, path: string, issues: string[]) => {
  if (value && !ID_PATTERN.test(value)) {
    issues.push(`${path} must use lowercase kebab-case.`);
  }
};

const validateExternalUrl = (value: string, path: string, issues: string[]) => {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) {
      issues.push(`${path} must be a credential-free HTTPS URL.`);
    }
  } catch (_error) {
    issues.push(`${path} must be a valid HTTPS URL.`);
  }
};

const normalizedWebUrl = (value: string) => {
  try {
    const url = new URL(value);
    url.hash = "";
    url.search = "";
    const pathname =
      url.pathname === "/" ? "" : url.pathname.replace(/\/+$/, "");
    return `${url.origin}${pathname}`;
  } catch (_error) {
    return null;
  }
};

const validateEmailAddress = (
  value: string,
  path: string,
  issues: string[],
) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    value.length > 254 ||
    /[\r\n\0]/.test(value) ||
    !emailPattern.test(value)
  ) {
    issues.push(`${path} must be a valid email address.`);
  }
};

const validatePhoneNumber = (value: string, path: string, issues: string[]) => {
  const digitCount = value.replace(/\D/g, "").length;
  if (!/^\+?[0-9 ()-]+$/.test(value) || digitCount < 7 || digitCount > 15) {
    issues.push(`${path} must be a valid international phone number.`);
  }
};

const validateCareerPeriod = (
  value: string,
  path: string,
  issues: string[],
  allowDetail: boolean,
) => {
  const period = parseCareerPeriod(value);
  if (!period) {
    issues.push(
      `${path} must use "Mon YYYY - Mon YYYY" or "Mon YYYY - Present" with a valid chronological range.`,
    );
    return null;
  }
  if (!allowDetail && period.detail) {
    issues.push(`${path} cannot include company detail text.`);
  }
  return period;
};

const validateAssetPath = (
  src: string,
  path: string,
  issues: string[],
  options: PortfolioValidationOptions,
) => {
  if (!LOCAL_ASSET_PATTERN.test(src) || src.includes("..")) {
    issues.push(
      `${path} must be a root-relative image path without traversal, query, or fragment segments.`,
    );
    return;
  }
  if (options.assetExists && !options.assetExists(src)) {
    issues.push(`${path} points to a missing public asset: ${src}.`);
  }
};

const validateImageAsset = (
  value: unknown,
  path: string,
  issues: string[],
  options: PortfolioValidationOptions,
) => {
  const image = recordAt(value, path, issues);
  const src = requiredString(image, "src", path, issues);
  requiredString(image, "alt", path, issues, true);
  positiveNumber(image, "width", path, issues);
  positiveNumber(image, "height", path, issues);
  if (src) validateAssetPath(src, `${path}.src`, issues, options);
};

const validateSocialImageAsset = (
  value: unknown,
  path: string,
  issues: string[],
  options: PortfolioValidationOptions,
) => {
  validateImageAsset(value, path, issues, options);
  const image = recordAt(value, path, issues);
  const mimeType = requiredString(image, "mimeType", path, issues);
  const supportedMimeType = mimeType as SocialImageMimeType;
  if (
    !Object.prototype.hasOwnProperty.call(
      SOCIAL_IMAGE_EXTENSIONS,
      supportedMimeType,
    )
  ) {
    issues.push(
      `${path}.mimeType must be image/png, image/jpeg, or image/webp.`,
    );
    return;
  }
  const src = typeof image.src === "string" ? image.src : "";
  const extension = src.split(".").pop()?.toLowerCase() ?? "";
  if (!SOCIAL_IMAGE_EXTENSIONS[supportedMimeType].includes(extension)) {
    issues.push(`${path}.mimeType must match the image file extension.`);
  }
};

const validateStringFields = (
  record: UnknownRecord,
  fields: string[],
  path: string,
  issues: string[],
) => fields.forEach((field) => requiredString(record, field, path, issues));

const validateUnique = (values: string[], path: string, issues: string[]) => {
  const seen = new Set<string>();
  values.forEach((value) => {
    if (seen.has(value))
      issues.push(`${path} contains duplicate id/value "${value}".`);
    seen.add(value);
  });
};

const validateHomeCopy = (value: unknown, issues: string[]) => {
  const home = recordAt(value, "home", issues);
  const fieldSets: Array<[string, string[]]> = [
    [
      "header",
      [
        "skipLink",
        "homeAriaLabel",
        "primaryNavigationLabel",
        "mobileNavigationLabel",
      ],
    ],
    [
      "hero",
      [
        "headlineLead",
        "headlineEmphasis",
        "intro",
        "primaryActionLabel",
        "portraitIndex",
        "profileLocationLabel",
        "profileStatement",
        "experienceBadgeSuffix",
        "scrollCueLabel",
        "resumeAriaLabel",
        "resumeDefaultLabel",
        "resumePreparingCompactLabel",
        "resumePreparingLabel",
        "resumeFailedLabel",
      ],
    ],
    [
      "experience",
      [
        "label",
        "heading",
        "tenurePrefix",
        "tenureSuffix",
        "timelineNowLabel",
        "caseLabel",
        "tenureLabel",
        "openSourceLabel",
      ],
    ],
    [
      "work",
      [
        "wordmark",
        "label",
        "heading",
        "intro",
        "projectLinkLabel",
        "projectNumber",
        "technologiesAriaLabel",
        "visitLabel",
      ],
    ],
    ["about", ["label", "heading", "body"]],
    ["skills", ["capabilitiesLabel", "heading", "intro"]],
    [
      "contact",
      [
        "atmosphereWord",
        "label",
        "heading",
        "intro",
        "emailActionLabel",
        "availabilityAriaLabel",
        "availabilityStatus",
        "availabilityStatement",
        "locationStatement",
        "emailLabel",
        "networkLabel",
        "codeLabel",
      ],
    ],
    ["footer", ["credit", "backToTopLabel"]],
  ];

  fieldSets.forEach(([sectionName, fields]) => {
    const section = recordAt(home[sectionName], `home.${sectionName}`, issues);
    validateStringFields(section, fields, `home.${sectionName}`, issues);
  });

  const mobile = recordAt(home.mobile, "home.mobile", issues);
  validateStringFields(
    mobile,
    [
      "heroIntro",
      "experienceHeading",
      "experienceIntroSuffix",
      "workIntro",
      "projectDescription",
      "aboutBody",
      "skillsIntro",
      "contactIntro",
    ],
    "home.mobile",
    issues,
  );
  const initiallyOpenSkillGroups = stringArray(
    mobile.initiallyOpenSkillGroups,
    "home.mobile.initiallyOpenSkillGroups",
    issues,
    true,
  );
  validateUnique(
    initiallyOpenSkillGroups,
    "home.mobile.initiallyOpenSkillGroups",
    issues,
  );

  const experience = recordAt(home.experience, "home.experience", issues);
  const affiliation = recordAt(
    experience.openSourceAffiliation,
    "home.experience.openSourceAffiliation",
    issues,
  );
  validateStringFields(
    affiliation,
    ["name", "cohort", "sourceSubtitle"],
    "home.experience.openSourceAffiliation",
    issues,
  );
  if (affiliation.logo !== "y-combinator") {
    issues.push(
      "home.experience.openSourceAffiliation.logo must be y-combinator.",
    );
  }
  requiredString(home, "impactAriaLabel", "home", issues);
};

export const validatePortfolioConfig = (
  value: unknown,
  options: PortfolioValidationOptions = {},
): PortfolioConfig => {
  const issues: string[] = [];
  const root = recordAt(value, "config", issues);

  const version = root.version;
  if (!Number.isInteger(version) || Number(version) < 1) {
    issues.push("config.version must be a positive integer.");
  }

  const identity = recordAt(root.identity, "identity", issues);
  validateStringFields(
    identity,
    ["fullName", "displayName", "initials", "jobTitle", "location"],
    "identity",
    issues,
  );
  validateImageAsset(identity.portrait, "identity.portrait", issues, options);

  const seo = recordAt(root.seo, "seo", issues);
  validateStringFields(
    seo,
    [
      "siteUrl",
      "siteName",
      "applicationName",
      "title",
      "description",
      "givenName",
      "familyName",
      "htmlLanguage",
      "openGraphLocale",
    ],
    "seo",
    issues,
  );
  validateExternalUrl(String(seo.siteUrl ?? ""), "seo.siteUrl", issues);
  validateSocialImageAsset(seo.socialImage, "seo.socialImage", issues, options);
  const siteUrl = String(seo.siteUrl ?? "");
  try {
    const parsedSiteUrl = new URL(siteUrl);
    if (
      parsedSiteUrl.protocol !== "https:" ||
      parsedSiteUrl.username ||
      parsedSiteUrl.password ||
      (parsedSiteUrl.pathname && parsedSiteUrl.pathname !== "/") ||
      parsedSiteUrl.search ||
      parsedSiteUrl.hash
    ) {
      issues.push(
        "seo.siteUrl must be an HTTPS origin without a path, query, or fragment.",
      );
    }
  } catch (_error) {
    // validateExternalUrl already reports the malformed URL.
  }
  const seoTitle = typeof seo.title === "string" ? seo.title.trim() : "";
  const seoDescription =
    typeof seo.description === "string" ? seo.description.trim() : "";
  if (seoTitle && (seoTitle.length < 30 || seoTitle.length > 60)) {
    issues.push("seo.title must be between 30 and 60 characters.");
  }
  if (
    seoDescription &&
    (seoDescription.length < 70 || seoDescription.length > 160)
  ) {
    issues.push("seo.description must be between 70 and 160 characters.");
  }
  if (
    typeof seo.htmlLanguage === "string" &&
    !/^[a-z]{2,3}(?:-[A-Z]{2}|-[a-z0-9]{4,8})?$/.test(seo.htmlLanguage)
  ) {
    issues.push("seo.htmlLanguage must be a valid BCP 47 language tag.");
  }
  if (
    typeof seo.openGraphLocale === "string" &&
    !/^[a-z]{2}_[A-Z]{2}$/.test(seo.openGraphLocale)
  ) {
    issues.push("seo.openGraphLocale must use the ll_CC format.");
  }
  const socialImage = recordAt(seo.socialImage, "seo.socialImage", issues);
  if (typeof socialImage.alt === "string" && !socialImage.alt.trim()) {
    issues.push("seo.socialImage.alt must describe the social sharing image.");
  }
  const knowsAboutExtra = stringArray(
    seo.knowsAboutExtra,
    "seo.knowsAboutExtra",
    issues,
  );
  validateUnique(knowsAboutExtra, "seo.knowsAboutExtra", issues);
  const ogCard = recordAt(seo.ogCard, "seo.ogCard", issues);
  (["taglineLines", "awardLines"] as const).forEach((field) => {
    const lines = stringArray(ogCard[field], `seo.ogCard.${field}`, issues);
    if (lines.length !== 2) {
      issues.push(`seo.ogCard.${field} must contain exactly two lines.`);
    }
    if (lines.some((line) => line.length > 28)) {
      issues.push(`seo.ogCard.${field} lines must be 28 characters or fewer.`);
    }
  });

  const navigation = arrayAt(root.navigation, "navigation", issues);
  const navigationIds: string[] = [];
  const navigationHrefs: string[] = [];
  navigation.forEach((item, index) => {
    const path = `navigation[${index}]`;
    const entry = recordAt(item, path, issues);
    const id = requiredString(entry, "id", path, issues);
    const label = requiredString(entry, "label", path, issues);
    const section = requiredString(entry, "section", path, issues);
    const href = requiredString(entry, "href", path, issues);
    void label;
    validateId(id, `${path}.id`, issues);
    if (!SECTION_IDS.has(section as PortfolioSectionId)) {
      issues.push(`${path}.section must be a known portfolio section.`);
    }
    if (href !== `#${section}`) {
      issues.push(`${path}.href must equal "#${section}".`);
    }
    if (href.toLowerCase().includes("resume-builder")) {
      issues.push(`${path}.href cannot expose the private resume builder.`);
    }
    navigationIds.push(id);
    navigationHrefs.push(href);
  });
  if (!navigation.length) issues.push("navigation cannot be empty.");
  validateUnique(navigationIds, "navigation ids", issues);
  validateUnique(navigationHrefs, "navigation hrefs", issues);

  validateHomeCopy(root.home, issues);

  const metrics = arrayAt(root.metrics, "metrics", issues);
  const metricIds: string[] = [];
  metrics.forEach((item, index) => {
    const path = `metrics[${index}]`;
    const metric = recordAt(item, path, issues);
    const id = requiredString(metric, "id", path, issues);
    validateStringFields(metric, ["value", "label", "context"], path, issues);
    validateId(id, `${path}.id`, issues);
    metricIds.push(id);
  });
  if (!metrics.length) issues.push("metrics cannot be empty.");
  validateUnique(metricIds, "metric ids", issues);

  const employers = arrayAt(root.employers, "employers", issues);
  const employerIds: string[] = [];
  const currentEmployerIds: string[] = [];
  const sourceCompanies: string[] = [];
  employers.forEach((item, index) => {
    const path = `employers[${index}]`;
    const employer = recordAt(item, path, issues);
    const id = requiredString(employer, "id", path, issues);
    const sourceCompany = requiredString(
      employer,
      "sourceCompany",
      path,
      issues,
    );
    const relationship = requiredString(
      employer,
      "schemaRelationship",
      path,
      issues,
    );
    validateId(id, `${path}.id`, issues);
    if (relationship !== "current" && relationship !== "former") {
      issues.push(
        `${path}.schemaRelationship must be either "current" or "former".`,
      );
    } else if (relationship === "current") {
      currentEmployerIds.push(id);
    }
    optionalString(employer, "parentOrganization", path, issues);
    const references = stringArray(
      employer.metricIds,
      `${path}.metricIds`,
      issues,
      true,
    );
    references.forEach((metricId) => {
      if (!metricIds.includes(metricId)) {
        issues.push(
          `${path}.metricIds references unknown metric "${metricId}".`,
        );
      }
    });

    const brand = recordAt(employer.brand, `${path}.brand`, issues);
    const kind = requiredString(brand, "kind", `${path}.brand`, issues);
    requiredString(brand, "ariaLabel", `${path}.brand`, issues);
    if (kind === "logo-pair") {
      validateImageAsset(
        brand.primaryLogo,
        `${path}.brand.primaryLogo`,
        issues,
        options,
      );
      validateImageAsset(
        brand.secondaryLogo,
        `${path}.brand.secondaryLogo`,
        issues,
        options,
      );
    } else if (kind === "client-lockup") {
      validateStringFields(
        brand,
        [
          "employerWordmark",
          "qualifier",
          "clientName",
          "roleWatermarkPeriod",
          "roleWatermarkPosition",
        ],
        `${path}.brand`,
        issues,
      );
      validateImageAsset(
        brand.clientLogo,
        `${path}.brand.clientLogo`,
        issues,
        options,
      );
    } else if (kind === "text") {
      requiredString(brand, "label", `${path}.brand`, issues);
    } else {
      issues.push(`${path}.brand.kind is not supported.`);
    }

    if (employer.award !== undefined) {
      const award = recordAt(employer.award, `${path}.award`, issues);
      validateStringFields(
        award,
        ["eyebrow", "title"],
        `${path}.award`,
        issues,
      );
      const highlights = arrayAt(
        award.highlights,
        `${path}.award.highlights`,
        issues,
      );
      if (highlights.length === 0) {
        issues.push(`${path}.award.highlights cannot be empty.`);
      }
      const highlightLabels: string[] = [];
      const highlightSchemaNames: string[] = [];
      const highlightResponsibilities: string[] = [];
      highlights.forEach((value, index) => {
        const highlightPath = `${path}.award.highlights[${index}]`;
        const highlight = recordAt(value, highlightPath, issues);
        validateStringFields(
          highlight,
          ["label", "detail", "schemaName", "sourceResponsibility"],
          highlightPath,
          issues,
        );
        if (typeof highlight.label === "string")
          highlightLabels.push(highlight.label);
        if (typeof highlight.schemaName === "string")
          highlightSchemaNames.push(highlight.schemaName);
        if (typeof highlight.sourceResponsibility === "string")
          highlightResponsibilities.push(highlight.sourceResponsibility);
      });
      validateUnique(highlightLabels, `${path}.award highlight labels`, issues);
      validateUnique(
        highlightSchemaNames,
        `${path}.award schema names`,
        issues,
      );
      validateUnique(
        highlightResponsibilities,
        `${path}.award source responsibilities`,
        issues,
      );
    }

    const domain = recordAt(employer.domain, `${path}.domain`, issues);
    const domainKind = requiredString(domain, "kind", `${path}.domain`, issues);
    if (
      domainKind !== "hospitality-platform" &&
      domainKind !== "global-commerce"
    ) {
      issues.push(
        `${path}.domain.kind must be either "hospitality-platform" or "global-commerce".`,
      );
    }
    validateStringFields(
      domain,
      [
        "eyebrow",
        "statement",
        "mobileStatement",
        "exposureLabel",
        "marketLabel",
      ],
      `${path}.domain`,
      issues,
    );
    stringArray(domain.exposure, `${path}.domain.exposure`, issues);
    validateImageAsset(
      domain.backgroundImage,
      `${path}.domain.backgroundImage`,
      issues,
      options,
    );

    const marketGroups = arrayAt(
      domain.marketGroups,
      `${path}.domain.marketGroups`,
      issues,
    );
    if (!marketGroups.length) {
      issues.push(`${path}.domain.marketGroups cannot be empty.`);
    }
    const marketGroupIds: string[] = [];
    const marketItemIds: string[] = [];
    marketGroups.forEach((groupValue, groupIndex) => {
      const groupPath = `${path}.domain.marketGroups[${groupIndex}]`;
      const group = recordAt(groupValue, groupPath, issues);
      const groupId = requiredString(group, "id", groupPath, issues);
      validateId(groupId, `${groupPath}.id`, issues);
      safeDisplayText(group, "label", groupPath, issues);
      optionalString(group, "detail", groupPath, issues);
      marketGroupIds.push(groupId);

      const marketItems = arrayAt(group.items, `${groupPath}.items`, issues);
      if (!marketItems.length) {
        issues.push(`${groupPath}.items cannot be empty.`);
      }
      marketItems.forEach((itemValue, itemIndex) => {
        const itemPath = `${groupPath}.items[${itemIndex}]`;
        const item = recordAt(itemValue, itemPath, issues);
        const itemId = requiredString(item, "id", itemPath, issues);
        validateId(itemId, `${itemPath}.id`, issues);
        safeDisplayText(item, "label", itemPath, issues);
        optionalString(item, "detail", itemPath, issues);
        marketItemIds.push(itemId);

        const flags = arrayAt(item.flags, `${itemPath}.flags`, issues);
        if (!flags.length) issues.push(`${itemPath}.flags cannot be empty.`);
        const flagCodes: string[] = [];
        flags.forEach((flagValue, flagIndex) => {
          const flagPath = `${itemPath}.flags[${flagIndex}]`;
          const flag = recordAt(flagValue, flagPath, issues);
          const code = requiredString(flag, "code", flagPath, issues);
          if (code && !MARKET_FLAG_CODE_PATTERN.test(code)) {
            issues.push(
              `${flagPath}.code must use an uppercase ISO-like country, region, or subdivision code.`,
            );
          }
          safeDisplayText(flag, "label", flagPath, issues);
          safeDisplayText(flag, "emoji", flagPath, issues, 32);
          flagCodes.push(code);
        });
        validateUnique(flagCodes, `${itemPath} flag codes`, issues);
      });
    });
    validateUnique(marketGroupIds, `${path}.domain market group ids`, issues);
    validateUnique(marketItemIds, `${path}.domain market item ids`, issues);

    employerIds.push(id);
    sourceCompanies.push(sourceCompany);
  });
  if (!employers.length) issues.push("employers cannot be empty.");
  validateUnique(employerIds, "employer ids", issues);
  validateUnique(sourceCompanies, "employer source companies", issues);
  if (currentEmployerIds.length !== 1) {
    issues.push(
      `employers must define exactly one current schemaRelationship; found ${currentEmployerIds.length}.`,
    );
  }

  const project = recordAt(root.project, "project", issues);
  const projectId = requiredString(project, "id", "project", issues);
  validateId(projectId, "project.id", issues);
  validateStringFields(
    project,
    ["resumeProjectName", "name", "eyebrow", "description", "liveUrl"],
    "project",
    issues,
  );
  validateExternalUrl(String(project.liveUrl ?? ""), "project.liveUrl", issues);
  validateImageAsset(project.image, "project.image", issues, options);
  stringArray(project.tech, "project.tech", issues);
  const projectSchema = recordAt(project.schema, "project.schema", issues);
  validateStringFields(projectSchema, ["genre"], "project.schema", issues);

  const skills = recordAt(root.skills, "skills", issues);
  const groups = arrayAt(skills.groups, "skills.groups", issues);
  const groupIds: string[] = [];
  groups.forEach((item, index) => {
    const path = `skills.groups[${index}]`;
    const group = recordAt(item, path, issues);
    const id = requiredString(group, "id", path, issues);
    validateId(id, `${path}.id`, issues);
    validateStringFields(group, ["label", "description"], path, issues);
    groupIds.push(id);
  });
  if (!groups.length) issues.push("skills.groups cannot be empty.");
  validateUnique(groupIds, "skill group ids", issues);

  const skillItems = arrayAt(skills.items, "skills.items", issues);
  const skillIds: string[] = [];
  const skillSources: string[] = [];
  skillItems.forEach((item, index) => {
    const path = `skills.items[${index}]`;
    const skill = recordAt(item, path, issues);
    const id = requiredString(skill, "id", path, issues);
    const source = requiredString(skill, "source", path, issues);
    const groupId = requiredString(skill, "groupId", path, issues);
    validateId(id, `${path}.id`, issues);
    requiredString(skill, "label", path, issues);
    const icon = optionalString(skill, "icon", path, issues);
    const mark = optionalString(skill, "mark", path, issues);
    if (!icon && !mark) {
      issues.push(`${path} must define either icon or mark.`);
    }
    if (icon) validateAssetPath(icon, `${path}.icon`, issues, options);
    if (!groupIds.includes(groupId)) {
      issues.push(`${path}.groupId references unknown group "${groupId}".`);
    }
    skillIds.push(id);
    skillSources.push(source);
  });
  if (!skillItems.length) issues.push("skills.items cannot be empty.");
  validateUnique(skillIds, "skill ids", issues);
  validateUnique(skillSources, "skill source names", issues);

  const downloads = recordAt(root.resumeDownloads, "resumeDownloads", issues);
  validateStringFields(
    downloads,
    ["defaultFileName", "studioExportFileName"],
    "resumeDownloads",
    issues,
  );
  if (
    typeof downloads.defaultFileName === "string" &&
    !downloads.defaultFileName.toLowerCase().endsWith(".pdf")
  ) {
    issues.push("resumeDownloads.defaultFileName must end in .pdf.");
  }
  if (
    typeof downloads.studioExportFileName === "string" &&
    !downloads.studioExportFileName.toLowerCase().endsWith(".json")
  ) {
    issues.push("resumeDownloads.studioExportFileName must end in .json.");
  }

  if (issues.length) throw new ContentConfigValidationError(issues);
  return value as PortfolioConfig;
};

const requiredResumeString = (
  value: unknown,
  path: string,
  issues: string[],
) => {
  if (typeof value !== "string" || !value.trim()) {
    issues.push(`${path} must be a non-empty string.`);
    return "";
  }
  return value.trim();
};

export const validatePortfolioBindings = (
  config: PortfolioConfig,
  resume: ResumeContentSource,
) => {
  const issues: string[] = [];
  const skillGroupIds = new Set(config.skills.groups.map((group) => group.id));
  config.home.mobile.initiallyOpenSkillGroups.forEach((groupId) => {
    if (!skillGroupIds.has(groupId)) {
      issues.push(
        `home.mobile.initiallyOpenSkillGroups references unknown skill group "${groupId}".`,
      );
    }
  });
  const resumeCompanies = resume.experience ?? [];
  const resumeCompanyNames = resumeCompanies
    .map((company) => company.company)
    .filter((company): company is string => Boolean(company));
  validateUnique(resumeCompanyNames, "resume employer names", issues);

  config.employers.forEach((employer) => {
    const sourceEmployer = resumeCompanies.find(
      (company) => company.company === employer.sourceCompany,
    );
    if (!sourceEmployer) {
      issues.push(
        `Employer mapping "${employer.id}" cannot find "${employer.sourceCompany}" in data/cv-data.json.`,
      );
      return;
    }
    const companyIndex = resumeCompanies.indexOf(sourceEmployer);
    const companyPath = `data/cv-data.json experience[${companyIndex}]`;
    const companyPeriodValue = requiredResumeString(
      sourceEmployer.companyPeriod,
      `${companyPath}.companyPeriod`,
      issues,
    );
    const companyPeriod = companyPeriodValue
      ? validateCareerPeriod(
          companyPeriodValue,
          `${companyPath}.companyPeriod`,
          issues,
          true,
        )
      : null;
    const companyIsCurrent = companyPeriod?.end === null;
    if (
      companyPeriod &&
      (employer.schemaRelationship === "current") !== companyIsCurrent
    ) {
      issues.push(
        `${companyPath}.companyPeriod must agree with the employer's ${employer.schemaRelationship} schemaRelationship.`,
      );
    }

    const roles = sourceEmployer.roles ?? [];
    if (roles.length === 0) {
      issues.push(`${companyPath}.roles cannot be empty.`);
    }
    if (employer.brand.kind === "client-lockup") {
      const { roleWatermarkPeriod, roleWatermarkPosition } = employer.brand;
      if (
        !roles.some(
          (role) =>
            role.position === roleWatermarkPosition &&
            role.period === roleWatermarkPeriod,
        )
      ) {
        issues.push(
          `${companyPath}.roles must include the configured client-logo watermark role "${roleWatermarkPosition}" (${roleWatermarkPeriod}).`,
        );
      }
    }
    let currentRoleCount = 0;
    roles.forEach((role, roleIndex) => {
      const rolePath = `${companyPath}.roles[${roleIndex}]`;
      requiredResumeString(role.position, `${rolePath}.position`, issues);
      const rolePeriodValue = requiredResumeString(
        role.period,
        `${rolePath}.period`,
        issues,
      );
      const rolePeriod = rolePeriodValue
        ? validateCareerPeriod(
            rolePeriodValue,
            `${rolePath}.period`,
            issues,
            false,
          )
        : null;
      if (rolePeriod?.end === null) currentRoleCount += 1;
      if (
        rolePeriod?.end === null &&
        employer.schemaRelationship !== "current"
      ) {
        issues.push(
          `${rolePath}.period cannot end in Present for a former employer.`,
        );
      }
      const responsibilities = role.responsibilities ?? [];
      if (responsibilities.length === 0) {
        issues.push(`${rolePath}.responsibilities cannot be empty.`);
      }
      responsibilities.forEach((responsibility, responsibilityIndex) => {
        requiredResumeString(
          responsibility,
          `${rolePath}.responsibilities[${responsibilityIndex}]`,
          issues,
        );
      });
    });
    if (employer.schemaRelationship === "current" && currentRoleCount === 0) {
      issues.push(`${companyPath}.roles must include a current role.`);
    }

    if (employer.award) {
      const responsibilities = (sourceEmployer.roles ?? []).flatMap(
        (role) => role.responsibilities ?? [],
      );
      employer.award.highlights.forEach(({ sourceResponsibility }) => {
        if (!responsibilities.includes(sourceResponsibility)) {
          issues.push(
            `Award for "${employer.id}" does not match a responsibility in data/cv-data.json.`,
          );
        }
      });
    }
  });
  const normalizeDisplayCopy = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  const configuredAwardTitle = config.employers.find(
    (employer) => employer.award,
  )?.award?.title;
  if (
    !configuredAwardTitle ||
    normalizeDisplayCopy(config.seo.ogCard.awardLines.join(" ")) !==
      normalizeDisplayCopy(configuredAwardTitle)
  ) {
    issues.push(
      "seo.ogCard.awardLines must match the configured employer award title.",
    );
  }
  resumeCompanyNames.forEach((company) => {
    if (
      !config.employers.some((employer) => employer.sourceCompany === company)
    ) {
      issues.push(`Resume employer "${company}" has no presentation mapping.`);
    }
  });

  if (
    resume.openSource?.subtitle !==
    config.home.experience.openSourceAffiliation.sourceSubtitle
  ) {
    issues.push(
      "home.experience.openSourceAffiliation.sourceSubtitle must match data/cv-data.json openSource.subtitle.",
    );
  }

  const resumeSkills = Array.from(
    new Set([
      ...(resume.technicalExpertise ?? []),
      ...(resume.skills ?? []),
      ...(resume.methodology ?? []),
      ...(resume.tools ?? []),
    ]),
  );
  const configuredSkills = config.skills.items.map((skill) => skill.source);
  resumeSkills.forEach((skill) => {
    if (!configuredSkills.includes(skill)) {
      issues.push(`Resume skill "${skill}" has no presentation mapping.`);
    }
  });
  configuredSkills.forEach((skill) => {
    if (!resumeSkills.includes(skill)) {
      issues.push(
        `Configured skill "${skill}" does not exist in data/cv-data.json.`,
      );
    }
  });

  if (
    !(resume.projects ?? []).some(
      (project) => project.name === config.project.resumeProjectName,
    )
  ) {
    issues.push(
      `Project mapping cannot find "${config.project.resumeProjectName}" in data/cv-data.json.`,
    );
  }
  if ((resume.projects ?? []).length !== 1) {
    issues.push(
      "data/cv-data.json must contain exactly one selected featured project.",
    );
  }

  const personalInfo = resume.personalInfo;
  const personalName = requiredResumeString(
    personalInfo?.name,
    "data/cv-data.json personalInfo.name",
    issues,
  );
  // The resume title and public portfolio title are intentionally independent,
  // but both are required so neither surface silently loses its role label.
  requiredResumeString(
    personalInfo?.title,
    "data/cv-data.json personalInfo.title",
    issues,
  );
  const personalLocation = requiredResumeString(
    personalInfo?.location,
    "data/cv-data.json personalInfo.location",
    issues,
  );
  const phone = requiredResumeString(
    personalInfo?.phone,
    "data/cv-data.json personalInfo.phone",
    issues,
  );
  const email = requiredResumeString(
    personalInfo?.email,
    "data/cv-data.json personalInfo.email",
    issues,
  );
  const website = requiredResumeString(
    personalInfo?.website,
    "data/cv-data.json personalInfo.website",
    issues,
  );
  const linkedin = requiredResumeString(
    personalInfo?.linkedin,
    "data/cv-data.json personalInfo.linkedin",
    issues,
  );
  const github = requiredResumeString(
    personalInfo?.github,
    "data/cv-data.json personalInfo.github",
    issues,
  );

  if (personalName && personalName !== config.identity.fullName) {
    issues.push(
      "identity.fullName must match personalInfo.name in data/cv-data.json.",
    );
  }
  if (personalLocation && personalLocation !== config.identity.location) {
    issues.push(
      "identity.location must match personalInfo.location in data/cv-data.json.",
    );
  }
  if (phone)
    validatePhoneNumber(phone, "data/cv-data.json personalInfo.phone", issues);
  if (email)
    validateEmailAddress(email, "data/cv-data.json personalInfo.email", issues);
  [
    [website, "data/cv-data.json personalInfo.website"],
    [linkedin, "data/cv-data.json personalInfo.linkedin"],
    [github, "data/cv-data.json personalInfo.github"],
  ].forEach(([value, path]) => {
    if (value) validateExternalUrl(value, path, issues);
  });
  if (
    website &&
    normalizedWebUrl(website) !== normalizedWebUrl(config.seo.siteUrl)
  ) {
    issues.push(
      "seo.siteUrl must match personalInfo.website in data/cv-data.json after normalization.",
    );
  }

  if (issues.length) throw new ContentConfigValidationError(issues);
  return true;
};

export const collectConfiguredAssetPaths = (config: PortfolioConfig) => {
  const assets = [
    config.identity.portrait.src,
    config.seo.socialImage.src,
    config.project.image.src,
    ...config.skills.items.flatMap((skill) => (skill.icon ? [skill.icon] : [])),
    ...config.employers.flatMap((employer) => {
      const domainAssets = [employer.domain.backgroundImage.src];
      if (employer.brand.kind === "logo-pair") {
        return [
          ...domainAssets,
          employer.brand.primaryLogo.src,
          employer.brand.secondaryLogo.src,
        ];
      }
      if (employer.brand.kind === "client-lockup") {
        return [...domainAssets, employer.brand.clientLogo.src];
      }
      return domainAssets;
    }),
  ];
  return Array.from(new Set(assets));
};

export const portfolioConfigSource: unknown = configSource;

export const portfolioConfig = validatePortfolioConfig(portfolioConfigSource);

export { parseCareerDate, parseCareerPeriod } from "./career";
