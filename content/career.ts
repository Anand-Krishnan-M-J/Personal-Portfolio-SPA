import type { CareerDate } from "./types";

const CAREER_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;
const CAREER_MONTH_INDEX = new Map(
  CAREER_MONTHS.map((month, index) => [month, index]),
);
const CAREER_DATE_PATTERN = new RegExp(
  `^(${CAREER_MONTHS.join("|")})\\s+(\\d{4})$`,
);
const CAREER_PERIOD_PATTERN = new RegExp(
  `^((?:${CAREER_MONTHS.join("|")})\\s+\\d{4}) - (Present|(?:${CAREER_MONTHS.join("|")})\\s+\\d{4})(?: · (.+))?$`,
);

export type ParsedCareerPeriod = {
  detail: string;
  end: CareerDate | null;
  endLabel: string;
  start: CareerDate;
  startLabel: string;
};

export const parseCareerDate = (value: string): CareerDate | null => {
  const match = value.trim().match(CAREER_DATE_PATTERN);
  if (!match) return null;
  const month = CAREER_MONTH_INDEX.get(
    match[1] as (typeof CAREER_MONTHS)[number],
  );
  const year = Number(match[2]);
  if (month === undefined || year < 1900 || year > 2100) return null;
  return { month, year };
};

export const parseCareerPeriod = (value: string): ParsedCareerPeriod | null => {
  const match = value.trim().match(CAREER_PERIOD_PATTERN);
  if (!match) return null;
  const start = parseCareerDate(match[1]);
  const end = match[2] === "Present" ? null : parseCareerDate(match[2]);
  if (!start || (match[2] !== "Present" && !end)) return null;
  if (end && end.year * 12 + end.month < start.year * 12 + start.month) {
    return null;
  }
  return {
    detail: match[3]?.trim() ?? "",
    end,
    endLabel: match[2],
    start,
    startLabel: match[1],
  };
};
