import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  collectConfiguredAssetPaths,
  portfolioConfigSource,
  validatePortfolioBindings,
  validatePortfolioConfig,
} from "../content/config";
import { resumeData } from "../content/selectors";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const publicRoot = path.join(projectRoot, "public");

const assetExists = (publicPath: string) => {
  const resolvedPath = path.resolve(publicRoot, publicPath.replace(/^\/+/, ""));
  const staysInsidePublic =
    resolvedPath === publicRoot ||
    resolvedPath.startsWith(`${publicRoot}${path.sep}`);
  return staysInsidePublic && existsSync(resolvedPath);
};

const config = validatePortfolioConfig(portfolioConfigSource, { assetExists });
validatePortfolioBindings(config, resumeData);

const skillCount = config.skills.items.length;
const assetCount = collectConfiguredAssetPaths(config).length;
process.stdout.write(
  `Content check passed: ${config.navigation.length} navigation links, ${config.employers.length} employers, ${skillCount} skills, ${assetCount} assets, and 1 featured project.\n`,
);
