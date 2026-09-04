import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  ContentConfigValidationError,
  parseCareerPeriod,
  portfolioConfig,
  portfolioConfigSource,
  validatePortfolioBindings,
  validatePortfolioConfig,
} from "../content/config";
import {
  buildPortfolioStructuredData,
  canonicalUrlForPath,
  careerStart,
  formatCareerTenure,
  getCareerTenure,
  getRoundedCareerYears,
  getEmployerAward,
  getEmployerMarketFlags,
  getEmployerMetrics,
  orderedExperience,
  personalProject,
  resumeData,
  serializeStructuredData,
  skillGroups,
  totalSkillCount,
} from "../content/selectors";
import type { PortfolioConfig, ResumeContentSource } from "../content/types";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const publicRoot = path.join(projectRoot, "public");
const require = createRequire(import.meta.url);
const assetExists = (publicPath: string) =>
  existsSync(path.join(publicRoot, publicPath.replace(/^\/+/, "")));
const cloneConfig = () =>
  JSON.parse(JSON.stringify(portfolioConfigSource)) as PortfolioConfig;
const cloneResume = () =>
  JSON.parse(JSON.stringify(resumeData)) as ResumeContentSource;

test("the checked-in content and all referenced assets are valid", () => {
  const config = validatePortfolioConfig(portfolioConfigSource, {
    assetExists,
  });
  assert.equal(validatePortfolioBindings(config, resumeData), true);
  assert.equal(
    config.project.resumeProjectName,
    resumeData.projects?.[0]?.name,
  );
  assert.equal(personalProject.name, config.project.name);
  assert.equal(resumeData.projects?.length, 1);
  assert.ok(
    config.navigation.every(
      (item) => !item.href.toLowerCase().includes("resume-builder"),
    ),
  );
});

test("validation rejects missing fields, unsafe URLs, and private navigation", () => {
  const missingCopy = cloneConfig();
  delete (missingCopy.home.hero as Partial<typeof missingCopy.home.hero>).intro;
  assert.throws(
    () => validatePortfolioConfig(missingCopy),
    ContentConfigValidationError,
  );

  const unsafeUrl = cloneConfig();
  unsafeUrl.project.liveUrl = "javascript:alert(1)";
  assert.throws(
    () => validatePortfolioConfig(unsafeUrl),
    /project\.liveUrl must be a credential-free HTTPS URL|valid HTTPS URL/,
  );

  const privateNavigation = cloneConfig();
  privateNavigation.navigation[0].href = "/resume-builder";
  assert.throws(
    () => validatePortfolioConfig(privateNavigation),
    /cannot expose the private resume builder/,
  );

  const missingMobileDomainCopy = cloneConfig();
  delete (
    missingMobileDomainCopy.employers[0].domain as Partial<
      (typeof missingMobileDomainCopy.employers)[number]["domain"]
    >
  ).mobileStatement;
  assert.throws(
    () => validatePortfolioConfig(missingMobileDomainCopy),
    /mobileStatement must be a non-empty string/,
  );
});

test("validation rejects duplicate ids and missing assets", () => {
  const duplicate = cloneConfig();
  duplicate.metrics[1].id = duplicate.metrics[0].id;
  assert.throws(
    () => validatePortfolioConfig(duplicate),
    /metric ids contains duplicate/,
  );

  const missingAsset = cloneConfig();
  missingAsset.project.image.src = "/images/does-not-exist.png";
  assert.throws(
    () => validatePortfolioConfig(missingAsset, { assetExists }),
    /missing public asset/,
  );

  const mismatchedSocialImage = cloneConfig();
  mismatchedSocialImage.seo.socialImage.mimeType = "image/jpeg";
  assert.throws(
    () => validatePortfolioConfig(mismatchedSocialImage),
    /mimeType must match the image file extension/,
  );
});

test("SEO validation rejects ambiguous origins and search metadata drift", () => {
  const pathSiteUrl = cloneConfig();
  pathSiteUrl.seo.siteUrl = "https://www.anandkris.com/portfolio";
  assert.throws(
    () => validatePortfolioConfig(pathSiteUrl),
    /HTTPS origin without a path, query, or fragment/,
  );

  const longDescription = cloneConfig();
  longDescription.seo.description = "x".repeat(161);
  assert.throws(
    () => validatePortfolioConfig(longDescription),
    /between 70 and 160 characters/,
  );

  const duplicateTopic = cloneConfig();
  duplicateTopic.seo.knowsAboutExtra.push(
    duplicateTopic.seo.knowsAboutExtra[0],
  );
  assert.throws(
    () => validatePortfolioConfig(duplicateTopic),
    /seo\.knowsAboutExtra contains duplicate/,
  );

  const malformedOgCard = cloneConfig();
  Reflect.set(malformedOgCard.seo.ogCard, "taglineLines", [
    "ONE LINE",
    "",
    "EXTRA",
  ]);
  assert.throws(
    () => validatePortfolioConfig(malformedOgCard),
    /seo\.ogCard\.taglineLines/,
  );
});

test("employer domain stories and branded skill logos stay config driven", () => {
  const invalidDomain = cloneConfig();
  invalidDomain.employers[0].domain.kind = "global-commerce";
  invalidDomain.employers[0].domain.exposure = [];
  assert.throws(
    () => validatePortfolioConfig(invalidDomain),
    /domain\.exposure cannot be empty/,
  );

  const missingMarketGroups = cloneConfig();
  missingMarketGroups.employers[0].domain.marketGroups = [];
  assert.throws(
    () => validatePortfolioConfig(missingMarketGroups),
    /domain\.marketGroups cannot be empty/,
  );

  const missingMarketLabel = cloneConfig();
  missingMarketLabel.employers[0].domain.marketLabel = "";
  assert.throws(
    () => validatePortfolioConfig(missingMarketLabel),
    /domain\.marketLabel must be a non-empty string/,
  );

  const unsafeMarketLabel = cloneConfig();
  unsafeMarketLabel.employers[0].domain.marketGroups[0].label =
    "<script>market</script>";
  assert.throws(
    () => validatePortfolioConfig(unsafeMarketLabel),
    /must be plain display text/,
  );

  const invalidFlagCode = cloneConfig();
  invalidFlagCode.employers[0].domain.marketGroups[0].items[0].flags[0].code =
    "usa";
  assert.throws(
    () => validatePortfolioConfig(invalidFlagCode),
    /uppercase ISO-like country, region, or subdivision code/,
  );

  const missingDomainImage = cloneConfig();
  missingDomainImage.employers[0].domain.backgroundImage.src =
    "/images/experience/missing.webp";
  assert.throws(
    () => validatePortfolioConfig(missingDomainImage, { assetExists }),
    /missing public asset/,
  );

  const openTable = portfolioConfig.employers.find(
    (employer) => employer.id === "opentable",
  );
  const uniqlo = portfolioConfig.employers.find(
    (employer) => employer.id === "qburst",
  );
  assert.ok(openTable);
  assert.ok(uniqlo);
  assert.match(openTable.domain.backgroundImage.src, /hospitality/);
  assert.match(uniqlo.domain.backgroundImage.src, /fashion-commerce/);
  assert.equal(openTable.domain.marketLabel, "Restaurant market reach");
  assert.equal(uniqlo.domain.marketLabel, "UNIQLO global footprint");
  assert.equal(uniqlo.brand.kind, "client-lockup");
  if (uniqlo.brand.kind !== "client-lockup")
    assert.fail("QBurst must use the UNIQLO client lockup");
  assert.equal(
    `${uniqlo.brand.roleWatermarkPosition} · ${uniqlo.brand.roleWatermarkPeriod}`,
    "Senior Software Engineer · Jan 2024 - Dec 2024",
  );
  assert.deepEqual(
    openTable.domain.marketGroups[0].items[0].flags.map((flag) => flag.code),
    ["US"],
  );
  assert.match(
    openTable.domain.marketGroups[0].items[0].detail ?? "",
    /New York.*Chicago.*Los Angeles/,
  );
  const scotlandFlag = uniqlo.domain.marketGroups
    .flatMap((group) => group.items)
    .flatMap((market) => market.flags)
    .find((flag) => flag.code === "GB-SCT");
  assert.ok(scotlandFlag);
  assert.equal(
    scotlandFlag.emoji,
    "\u{1f3f4}\u{e0067}\u{e0062}\u{e0073}\u{e0063}\u{e0074}\u{e007f}",
  );

  const brandedSkillIds = [
    "rtk-query",
    "redux-saga",
    "pwa",
    "react-three-fiber",
    "teamcity",
    "mixpanel",
    "cursor",
    "codex",
    "claude",
    "gemini-flash",
    "openai",
  ];
  brandedSkillIds.forEach((skillId) => {
    const skill = portfolioConfig.skills.items.find(
      (candidate) => candidate.id === skillId,
    );
    assert.ok(skill?.icon, `${skillId} must use a local logo asset`);
    assert.equal(skill.mark, undefined);
  });

  const invalidWatermark = cloneConfig();
  const invalidQburst = invalidWatermark.employers.find(
    (employer) => employer.id === "qburst",
  );
  if (!invalidQburst || invalidQburst.brand.kind !== "client-lockup")
    assert.fail("Missing QBurst client-lockup fixture");
  invalidQburst.brand.roleWatermarkPeriod = "Sep 2020 - Dec 2023";
  assert.throws(
    () => validatePortfolioBindings(invalidWatermark, resumeData),
    /configured client-logo watermark role/,
  );

  const mismatchedAffiliation = cloneConfig();
  mismatchedAffiliation.home.experience.openSourceAffiliation.sourceSubtitle =
    "(Different accelerator)";
  assert.throws(
    () => validatePortfolioBindings(mismatchedAffiliation, resumeData),
    /openSourceAffiliation\.sourceSubtitle must match/,
  );

  const mismatchedOgAward = cloneConfig();
  mismatchedOgAward.seo.ogCard.awardLines = ["Different", "Award"];
  assert.throws(
    () => validatePortfolioBindings(mismatchedOgAward, resumeData),
    /ogCard\.awardLines must match/,
  );

  const mismatchedAwardSource = cloneConfig();
  const mismatchedAwardEmployer = mismatchedAwardSource.employers.find(
    (employer) => employer.award,
  );
  assert.ok(mismatchedAwardEmployer?.award);
  mismatchedAwardEmployer.award.highlights[0].sourceResponsibility =
    "A claim that is not present in the resume.";
  assert.throws(
    () => validatePortfolioBindings(mismatchedAwardSource, resumeData),
    /does not match a responsibility/,
  );
});

test("validation rejects invalid contact details and career periods", () => {
  const invalidContact = cloneResume();
  if (!invalidContact.personalInfo)
    assert.fail("Missing personal info fixture");
  invalidContact.personalInfo.email = "not-an-email";
  invalidContact.personalInfo.phone = "123";
  invalidContact.personalInfo.title = "";
  assert.throws(
    () => validatePortfolioBindings(portfolioConfig, invalidContact),
    /personalInfo\.email must be a valid email address|personalInfo\.phone must be a valid international phone number|personalInfo\.title must be a non-empty string/,
  );

  const invalidPeriod = cloneResume();
  const firstRole = invalidPeriod.experience?.[0]?.roles?.[0];
  if (!firstRole) assert.fail("Missing role fixture");
  firstRole.period = "January 2025 - Present";
  assert.throws(
    () => validatePortfolioBindings(portfolioConfig, invalidPeriod),
    /must use "Mon YYYY - Mon YYYY"/,
  );

  assert.equal(parseCareerPeriod("Sep 2020 - Dec 2024")?.end?.year, 2024);
  assert.equal(parseCareerPeriod("Sep 2020 - Aug 2020"), null);
});

test("employer relationships are the canonical SEO source", () => {
  const noCurrentEmployer = cloneConfig();
  noCurrentEmployer.employers.forEach((employer) => {
    employer.schemaRelationship = "former";
  });
  assert.throws(
    () => validatePortfolioConfig(noCurrentEmployer),
    /exactly one current schemaRelationship/,
  );

  const swappedRelationships = cloneConfig();
  swappedRelationships.employers.forEach((employer) => {
    employer.schemaRelationship =
      employer.schemaRelationship === "current" ? "former" : "current";
  });
  const swappedConfig = validatePortfolioConfig(swappedRelationships);
  assert.throws(
    () => validatePortfolioBindings(swappedConfig, resumeData),
    /companyPeriod must agree with the employer's/,
  );
});

test("skill and employer selectors preserve the CV source ordering", () => {
  const sourceSkills = Array.from(
    new Set([
      ...(resumeData.technicalExpertise ?? []),
      ...(resumeData.skills ?? []),
      ...(resumeData.methodology ?? []),
      ...(resumeData.tools ?? []),
    ]),
  );
  const selectedSkills = skillGroups.flatMap((group) =>
    group.items.map((item) => item.source),
  );
  assert.equal(totalSkillCount, sourceSkills.length);
  assert.deepEqual(new Set(selectedSkills), new Set(sourceSkills));
  const currentEmployer = portfolioConfig.employers.find(
    (employer) => employer.schemaRelationship === "current",
  );
  assert.equal(orderedExperience[0]?.company, currentEmployer?.sourceCompany);
  const metricEmployer = portfolioConfig.employers.find(
    (employer) => employer.metricIds.length > 0,
  );
  assert.ok(metricEmployer);
  assert.equal(
    getEmployerMetrics(metricEmployer.sourceCompany).length,
    metricEmployer.metricIds.length,
  );

  const openTableFlags = getEmployerMarketFlags("OpenTable");
  const qburstFlags = getEmployerMarketFlags("QBurst");
  assert.equal(openTableFlags.length, 16);
  assert.equal(qburstFlags.length, 17);
  assert.ok(openTableFlags.some((flag) => flag.code === "LAC"));
  assert.ok(qburstFlags.some((flag) => flag.code === "GB-SCT"));

  const awardedEmployer = portfolioConfig.employers.find(
    (employer) => employer.award,
  );
  assert.ok(awardedEmployer);
  const award = getEmployerAward(awardedEmployer.sourceCompany);
  assert.ok(award);
  const sourceEmployer = resumeData.experience?.find(
    (employer) => employer.company === awardedEmployer.sourceCompany,
  );
  const responsibilities = (sourceEmployer?.roles ?? []).flatMap(
    (role) => role.responsibilities ?? [],
  );
  assert.equal(award.highlights.length, 2);
  award.highlights.forEach((highlight) =>
    assert.ok(responsibilities.includes(highlight.sourceResponsibility)),
  );

  const publicRoleResponsibilities = orderedExperience.flatMap((employer) =>
    (employer.roles ?? []).flatMap((role) => role.responsibilities ?? []),
  );
  assert.equal(publicRoleResponsibilities.length, 17);
});

test("mobile presentation stays concise and references real skill groups", () => {
  const mobile = portfolioConfig.home.mobile;
  const skillGroupIds = new Set(
    portfolioConfig.skills.groups.map(({ id }) => id),
  );
  assert.ok(mobile.heroIntro.length < portfolioConfig.home.hero.intro.length);
  assert.deepEqual(mobile.initiallyOpenSkillGroups, []);
  assert.ok(
    mobile.initiallyOpenSkillGroups.every((groupId) =>
      skillGroupIds.has(groupId),
    ),
  );
  assert.ok(
    portfolioConfig.employers.every(
      (employer) =>
        employer.domain.mobileStatement.length <
        employer.domain.statement.length,
    ),
  );

  const unknownSkillGroup = cloneConfig();
  unknownSkillGroup.home.mobile.initiallyOpenSkillGroups.push("unknown");
  const validated = validatePortfolioConfig(unknownSkillGroup);
  assert.throws(
    () => validatePortfolioBindings(validated, resumeData),
    /references unknown skill group "unknown"/,
  );
});

test("career dates and SEO selectors remain deterministic", () => {
  const parsedCareerStarts = (resumeData.experience ?? [])
    .flatMap((company) => company.roles ?? [])
    .map((role) => parseCareerPeriod(role.period ?? "")?.start ?? null)
    .filter((date): date is NonNullable<typeof date> => Boolean(date));
  const expectedCareerStart = parsedCareerStarts.reduce(
    (earliest, candidate) =>
      candidate.year * 12 + candidate.month <
      earliest.year * 12 + earliest.month
        ? candidate
        : earliest,
  );
  assert.deepEqual(careerStart, expectedCareerStart);
  assert.deepEqual(
    getCareerTenure(new Date(careerStart.year + 6, careerStart.month + 2, 1)),
    {
      months: 2,
      years: 6,
    },
  );
  assert.equal(getRoundedCareerYears({ months: 11, years: 5 }), 6);
  assert.equal(formatCareerTenure({ months: 5, years: 5 }), "5 years");
  assert.equal(formatCareerTenure({ months: 6, years: 5 }), "6 years");
  assert.equal(
    canonicalUrlForPath("/resume-builder/?template=original#preview"),
    `${portfolioConfig.seo.siteUrl}/resume-builder`,
  );

  const structuredData = buildPortfolioStructuredData();
  const serialized = serializeStructuredData({ ...structuredData, probe: "<" });
  assert.match(serialized, /CreativeWork/);
  assert.ok(!serialized.includes("<"));
  assert.match(serialized, /\\u003c/);
});

test("structured data has unique, resolved entities without invented reviews", () => {
  const structuredData = buildPortfolioStructuredData();
  const graph = structuredData["@graph"] as Array<Record<string, unknown>>;
  const ids = graph
    .map((node) => node["@id"])
    .filter((value): value is string => typeof value === "string");
  assert.equal(new Set(ids).size, ids.length);

  const referencedIds: string[] = [];
  const collectReferences = (value: unknown, isGraphNode = false) => {
    if (Array.isArray(value)) {
      value.forEach((item) => collectReferences(item));
      return;
    }
    if (!value || typeof value !== "object") return;
    Object.entries(value as Record<string, unknown>).forEach(([key, item]) => {
      if (key === "@id" && !isGraphNode && typeof item === "string") {
        referencedIds.push(item);
      } else {
        collectReferences(item);
      }
    });
  };
  graph.forEach((node) => collectReferences(node, true));
  referencedIds.forEach((id) =>
    assert.ok(
      ids.includes(id),
      `Structured-data reference must resolve: ${id}`,
    ),
  );

  const organizations = graph.filter(
    (node) => node["@type"] === "Organization",
  );
  assert.deepEqual(
    new Set(organizations.map((node) => node.name)),
    new Set(["OpenTable", "Booking Holdings", "QBurst"]),
  );
  const person = graph.find((node) => node["@type"] === "Person");
  assert.ok(Array.isArray(person?.award));
  assert.deepEqual(
    person?.award,
    portfolioConfig.employers.flatMap(
      (employer) =>
        employer.award?.highlights.map((highlight) => highlight.schemaName) ??
        [],
    ),
  );
  const project = graph.find((node) => node["@type"] === "CreativeWork");
  assert.equal(project?.isAccessibleForFree, true);
  assert.equal(
    graph.some((node) => node["@type"] === "Review"),
    false,
  );
  assert.equal(
    graph.some((node) => node["@type"] === "AggregateRating"),
    false,
  );
});

test("generated discovery files and production headers stay config aligned", async () => {
  const generatedMetadata = JSON.parse(
    readFileSync(
      path.join(projectRoot, "content", "site-metadata.generated.json"),
      "utf8",
    ),
  ) as Record<string, unknown>;
  const manifest = JSON.parse(
    readFileSync(path.join(publicRoot, "site.webmanifest"), "utf8"),
  ) as Record<string, unknown>;
  const robots = readFileSync(path.join(publicRoot, "robots.txt"), "utf8");
  const sitemap = readFileSync(path.join(publicRoot, "sitemap.xml"), "utf8");
  assert.equal(generatedMetadata.description, portfolioConfig.seo.description);
  assert.equal(generatedMetadata.title, portfolioConfig.seo.title);
  assert.equal(manifest.description, portfolioConfig.seo.description);
  assert.match(robots, /Sitemap: https:\/\/www\.anandkris\.com\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/www\.anandkris\.com\/<\/loc>/);
  assert.doesNotMatch(sitemap, /resume-builder/);

  const nextConfig = require("../next.config.js") as {
    headers: () => Promise<
      Array<{ headers: Array<{ key: string; value: string }>; source: string }>
    >;
    redirects: () => Promise<
      Array<{ destination: string; permanent: boolean; source: string }>
    >;
  };
  const headers = await nextConfig.headers();
  const resumeHeaders = headers.find(
    (entry) => entry.source === "/resume-builder/:path*",
  );
  assert.match(
    resumeHeaders?.headers.find((header) => header.key === "X-Robots-Tag")
      ?.value ?? "",
    /noindex.*noimageindex/,
  );
  const redirects = await nextConfig.redirects();
  assert.ok(
    redirects.some(
      (redirect) =>
        redirect.source === "/:path*" &&
        redirect.destination === "https://www.anandkris.com/:path*" &&
        redirect.permanent,
    ),
  );
});
