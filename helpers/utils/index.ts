export const joinClass = (...classNames: string[]): string =>
  classNames
    .filter((className: string) => !!className)
    .map((className: string) => className)
    .join(" ");

export const isMobileDevice = () => {
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(navigator.userAgent);
};

export function calculateExperience(): string {
  const startDate: Date = new Date("2020-09-09");
  const currentDate: Date = new Date();
  let yearsDiff: number = currentDate.getFullYear() - startDate.getFullYear();
  let monthsDiff: number = currentDate.getMonth() - startDate.getMonth();

  if (monthsDiff < 0) {
    yearsDiff--;
    monthsDiff += 12;
  }
  const experience = `${yearsDiff} years and ${monthsDiff} months`;
  return experience;
}
