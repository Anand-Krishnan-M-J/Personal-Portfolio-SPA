/**
 * Compatibility exports for portfolio components.
 *
 * Edit content/portfolio.config.json and data/cv-data.json instead of adding
 * presentation copy to this module.
 */
export {
  careerStart,
  employerPresentations,
  getCareerTenure,
  getDisplayPeriod,
  getEmployerAward,
  getEmployerMarketFlags,
  getEmployerMetrics,
  getEmployerPresentation,
  formatCareerTenure,
  getRoundedCareerYears,
  homepageCopy,
  impactMetrics,
  metricContext,
  navigation,
  orderedExperience,
  personalProject,
  resumeData,
  skillGroups,
  totalSkillCount,
} from "../../content/selectors";

export { portfolioConfig } from "../../content/runtime";

export type {
  EmployerBrand,
  EmployerPresentation,
  PortfolioProject,
  PortfolioSkill,
  PortfolioSkillGroup,
} from "../../content/types";
