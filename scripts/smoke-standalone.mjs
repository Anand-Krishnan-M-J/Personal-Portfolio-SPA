import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const host = "127.0.0.1";
const port = process.env.PORTFOLIO_SMOKE_PORT ?? "4127";
const origin = `http://${host}:${port}`;
const serverPath = ".next/standalone/server.js";

if (!existsSync(serverPath)) {
  throw new Error(`Missing ${serverPath}; run npm run build first.`);
}

const server = spawn(process.execPath, [serverPath], {
  env: { ...process.env, HOSTNAME: host, PORT: port },
  stdio: ["ignore", "pipe", "pipe"],
});
let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

const fetchWhenReady = async (url) => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      return await fetch(url, { redirect: "manual" });
    } catch (_error) {
      await delay(250);
    }
  }
  throw new Error(`Standalone server did not become ready.\n${serverOutput}`);
};

try {
  const home = await fetchWhenReady(`${origin}/`);
  if (
    !home.ok ||
    !(await home.text()).includes("Senior Software Engineer") ||
    !home.headers
      .get("content-security-policy")
      ?.includes("object-src 'none'") ||
    !home.headers.get("strict-transport-security")?.includes("max-age=")
  ) {
    throw new Error(`Homepage smoke check failed with ${home.status}.`);
  }

  const resume = await fetch(`${origin}/resume-builder`);
  if (!resume.ok || !resume.headers.get("x-robots-tag")?.includes("noindex")) {
    throw new Error("Resume privacy header smoke check failed.");
  }

  const optimizedImage = await fetch(
    `${origin}/_next/image?url=%2Fimages%2Fprofile.webp&w=640&q=75`,
  );
  if (
    !optimizedImage.ok ||
    !optimizedImage.headers.get("content-type")?.startsWith("image/")
  ) {
    throw new Error("Next image optimization smoke check failed.");
  }

  const retiredRoute = await fetch(`${origin}/projects/legacy`, {
    redirect: "manual",
  });
  if (
    retiredRoute.status !== 308 ||
    retiredRoute.headers.get("location") !== "/#work"
  ) {
    throw new Error("Legacy-route redirect smoke check failed.");
  }

  console.log(
    "Standalone homepage, privacy, image, and redirect smoke passed.",
  );
} finally {
  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    delay(2_000),
  ]);
}
