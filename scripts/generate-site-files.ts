import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { portfolioConfig } from "../content/config";
import { resumeData, SITE_HOME_URL, SITE_URL } from "../content/selectors";

const publicDirectory = resolve(process.cwd(), "public");
const contentDirectory = resolve(process.cwd(), "content");
const absoluteUrl = (publicPath: string) =>
  new URL(publicPath.replace(/^\/+/, ""), SITE_HOME_URL).toString();
const shortcutFor = (section: "experience" | "work" | "contact") => {
  const item = portfolioConfig.navigation.find(
    (navigationItem) => navigationItem.section === section,
  );
  if (!item) throw new Error(`Missing ${section} navigation item.`);
  return {
    name: section === "work" ? portfolioConfig.project.name : item.label,
    short_name: item.label,
    url: `/${item.href}`,
  };
};

const manifest = {
  id: "/",
  name: `${portfolioConfig.identity.displayName} — Software Engineering Portfolio`,
  short_name: portfolioConfig.identity.displayName,
  description: portfolioConfig.seo.description,
  start_url: "/",
  scope: "/",
  display: "standalone",
  display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
  background_color: "#f7f1e8",
  theme_color: "#a77a50",
  lang: portfolioConfig.seo.htmlLanguage,
  dir: "ltr",
  categories: ["portfolio", "business", "productivity"],
  icons: [
    {
      src: "/brand-mark.svg",
      sizes: "any",
      type: "image/svg+xml",
      purpose: "any",
    },
    {
      src: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
  ],
  shortcuts: [
    shortcutFor("experience"),
    shortcutFor("work"),
    shortcutFor("contact"),
  ],
};

const escapeXml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[character] ?? character,
  );

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeXml(SITE_HOME_URL)}</loc>
  </url>
</urlset>
`;

const robots = `User-agent: *
Allow: /
# /resume-builder stays crawlable so its noindex meta and response header can be read.
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;

const siteMetadata = {
  applicationName: portfolioConfig.seo.applicationName,
  author: portfolioConfig.identity.fullName,
  brandMarkTitle: `${portfolioConfig.identity.initials} — ${portfolioConfig.identity.displayName}`,
  description: portfolioConfig.seo.description,
  homeUrl: SITE_HOME_URL,
  htmlLanguage: portfolioConfig.seo.htmlLanguage,
  openGraphLocale: portfolioConfig.seo.openGraphLocale,
  profileImageUrl: absoluteUrl(portfolioConfig.identity.portrait.src),
  siteName: portfolioConfig.seo.siteName,
  siteUrl: SITE_URL,
  socialImageAlt: portfolioConfig.seo.socialImage.alt,
  socialImageHeight: portfolioConfig.seo.socialImage.height,
  socialImageType: portfolioConfig.seo.socialImage.mimeType,
  socialImageUrl: absoluteUrl(portfolioConfig.seo.socialImage.src),
  socialImageWidth: portfolioConfig.seo.socialImage.width,
  socialProfileUrls: [
    resumeData.personalInfo?.linkedin,
    resumeData.personalInfo?.github,
  ].filter((url): url is string => Boolean(url)),
  title: portfolioConfig.seo.title,
};

writeFileSync(
  resolve(publicDirectory, "site.webmanifest"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
writeFileSync(resolve(publicDirectory, "sitemap.xml"), sitemap);
writeFileSync(resolve(publicDirectory, "robots.txt"), robots);
writeFileSync(
  resolve(contentDirectory, "site-metadata.generated.json"),
  `${JSON.stringify(siteMetadata, null, 2)}\n`,
);

console.log(
  "Generated metadata, manifest, sitemap, and robots.txt from portfolio config.",
);
