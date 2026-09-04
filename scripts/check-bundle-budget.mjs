import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const buildManifest = JSON.parse(
  readFileSync(".next/build-manifest.json", "utf8"),
);
const loadableManifest = JSON.parse(
  readFileSync(".next/react-loadable-manifest.json", "utf8"),
);

const routeBudgetBytes = {
  "/": 115 * 1024,
  "/resume-builder": 125 * 1024,
};

const initialFilesFor = (route) =>
  Array.from(
    new Set([
      ...(buildManifest.rootMainFiles ?? []),
      ...(buildManifest.pages["/_app"] ?? []),
      ...(buildManifest.pages[route] ?? []),
    ]),
  ).filter((file) => file.endsWith(".js"));

for (const [route, budget] of Object.entries(routeBudgetBytes)) {
  const files = initialFilesFor(route);
  const gzipBytes = files.reduce((total, file) => {
    const source = readFileSync(`.next/${file}`);
    return total + gzipSync(source).byteLength;
  }, 0);
  if (gzipBytes > budget) {
    throw new Error(
      `${route} initial JavaScript is ${gzipBytes} gzip bytes; budget is ${budget}.`,
    );
  }
  console.log(`${route}: ${gzipBytes} gzip bytes (${files.length} files)`);
}

const pdfBoundary = Object.entries(loadableManifest).find(([key]) =>
  key.includes("ResumePdfRenderer"),
);
if (!pdfBoundary) {
  throw new Error("The deferred resume PDF boundary is missing.");
}

const deferredPdfFiles = new Set(
  pdfBoundary[1].files.filter((file) => file.endsWith(".js")),
);
const resumeInitialFiles = new Set(initialFilesFor("/resume-builder"));
const leakedPdfFiles = [...deferredPdfFiles].filter((file) =>
  resumeInitialFiles.has(file),
);
if (leakedPdfFiles.length) {
  throw new Error(
    `React-PDF leaked into the initial resume route: ${leakedPdfFiles.join(", ")}`,
  );
}

console.log(
  `React-PDF remains deferred across ${deferredPdfFiles.size} JavaScript chunks.`,
);
