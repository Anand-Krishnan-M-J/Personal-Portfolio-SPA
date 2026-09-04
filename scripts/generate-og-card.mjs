import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

import portfolioConfig from "../content/portfolio.config.json" with { type: "json" };

const WIDTH = 1200;
const HEIGHT = 630;
const projectRoot = resolve(import.meta.dirname, "..");
const fontCacheDirectory = resolve(tmpdir(), "portfolio-fontconfig-cache");
mkdirSync(fontCacheDirectory, { recursive: true });
process.env.FONTCONFIG_FILE = resolve(import.meta.dirname, "fontconfig.xml");
process.env.FONTCONFIG_PATH = import.meta.dirname;
const { default: sharp } = await import("sharp");
const fontFile = resolve(
  projectRoot,
  "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf",
);

const palette = {
  accent: "#a77a50",
  accentDeep: "#77573b",
  accentLight: "#d1a87e",
  background: "#f7f1e8",
  ink: "#1b1917",
  paper: "#fffaf3",
  rule: "#d8c4ae",
};

const escapeMarkup = (value) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
        "<": "&lt;",
        ">": "&gt;",
      })[character],
  );

const textLayer = ({
  color,
  height,
  left,
  size,
  text,
  top,
  tracking = 0,
  weight = 500,
  width,
}) => ({
  input: {
    text: {
      align: "left",
      font: "Geist",
      fontfile: fontFile,
      height,
      rgba: true,
      text: `<span foreground="${color}" font_size="${size}pt" font_weight="${weight}" letter_spacing="${Math.round(
        tracking * 1024,
      )}">${escapeMarkup(text)}</span>`,
      width,
      wrap: "none",
    },
  },
  left,
  top,
});

const brandNames = [];
for (const employer of portfolioConfig.employers) {
  if (employer.brand.kind === "logo-pair") {
    brandNames.push(employer.sourceCompany, employer.parentOrganization);
  } else if (employer.brand.kind === "client-lockup") {
    brandNames.push(employer.brand.clientName);
  } else {
    brandNames.push(employer.brand.label);
  }
}
const brandLine = [...new Set(brandNames.filter(Boolean))]
  .join(" · ")
  .toUpperCase();
const [taglineLead, taglineEnd] = portfolioConfig.seo.ogCard.taglineLines;
const [awardLead, awardEnd] = portfolioConfig.seo.ogCard.awardLines;
const jobWords = portfolioConfig.identity.jobTitle.split(/\s+/);
const jobTitleEnd = jobWords.pop() ?? "Engineer";
const jobTitleLead = jobWords.join(" ");
const siteHost = new URL(portfolioConfig.seo.siteUrl).hostname.replace(
  /^www\./,
  "",
);
const skillLine = portfolioConfig.skills.items
  .slice(0, 4)
  .map((skill) => skill.label)
  .join(" · ");

const shapes = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.background}"/>
    <rect width="18" height="${HEIGHT}" fill="${palette.accent}"/>
    <path d="M74 151h1052M74 420h1052" stroke="${palette.rule}" stroke-width="2"/>
    <rect x="75" y="58" width="70" height="70" rx="19" fill="${palette.paper}" stroke="${palette.accent}" stroke-width="1.5"/>
    <path d="M89 111l13-32.3 13 32.3M94.3 97.8h15.4M116.6 79v32" fill="none" stroke="${palette.ink}" stroke-width="4.2" stroke-linecap="square"/>
    <path d="M117.2 95.4l14.4-16.3M117.2 95.1l14.8 15.7" fill="none" stroke="${palette.accent}" stroke-width="4.2" stroke-linecap="square"/>
    <path d="M832 217h294" stroke="${palette.accent}" stroke-width="7"/>
    <rect x="850" y="485" width="276" height="82" rx="18" fill="${palette.ink}"/>
  </svg>
`);

const layers = [
  { input: shapes, left: 0, top: 0 },
  textLayer({
    color: palette.ink,
    left: 165,
    size: 27,
    text: portfolioConfig.identity.fullName.toUpperCase(),
    top: 65,
    tracking: 1.1,
    weight: 700,
    width: 720,
  }),
  textLayer({
    color: palette.accentDeep,
    left: 165,
    size: 17,
    text: `PORTFOLIO · ${siteHost.toUpperCase()}`,
    top: 101,
    tracking: 1.8,
    weight: 600,
    width: 720,
  }),
  textLayer({
    color: palette.ink,
    left: 74,
    size: 72,
    text: jobTitleLead,
    top: 165,
    weight: 700,
    width: 730,
  }),
  textLayer({
    color: palette.ink,
    left: 74,
    size: 88,
    text: jobTitleEnd,
    top: 251,
    weight: 700,
    width: 730,
  }),
  textLayer({
    color: palette.accentDeep,
    left: 833,
    size: 18,
    text: taglineLead,
    top: 230,
    tracking: 1.1,
    weight: 700,
    width: 293,
  }),
  textLayer({
    color: palette.accentDeep,
    left: 833,
    size: 18,
    text: taglineEnd,
    top: 260,
    tracking: 1.1,
    weight: 700,
    width: 293,
  }),
  textLayer({
    color: palette.accentDeep,
    left: 75,
    size: 24,
    text: skillLine,
    top: 439,
    weight: 600,
    width: 990,
  }),
  textLayer({
    color: palette.ink,
    left: 75,
    size: 19,
    text: brandLine,
    top: 515,
    tracking: 0.7,
    weight: 700,
    width: 735,
  }),
  textLayer({
    color: palette.accentLight,
    left: 876,
    size: 15,
    text: awardLead.toUpperCase(),
    top: 500,
    tracking: 1.1,
    weight: 700,
    width: 225,
  }),
  textLayer({
    color: palette.paper,
    left: 876,
    size: 16,
    text: awardEnd.toUpperCase(),
    top: 529,
    tracking: 0.8,
    weight: 700,
    width: 225,
  }),
];

const output = resolve(projectRoot, "public/og.png");
await sharp({
  create: {
    background: palette.background,
    channels: 4,
    height: HEIGHT,
    width: WIDTH,
  },
})
  .composite(layers)
  .png({ adaptiveFiltering: true, compressionLevel: 9 })
  .toFile(output);

console.log(`Generated ${output} (${WIDTH}x${HEIGHT}).`);
