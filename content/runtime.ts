import cvDataSource from "../data/cv-data.json";
import type { CVData } from "../components/resumeBuilder/types";
import configSource from "./portfolio.config.json";
import type { PortfolioConfig } from "./types";

// Runtime consumers use data that has already passed content:check in dev,
// CI, and prebuild. Keeping validation out of this module avoids shipping the
// validation engine in the client bundle.
export const portfolioConfig = configSource as unknown as PortfolioConfig;
export const resumeData = cvDataSource satisfies CVData;
