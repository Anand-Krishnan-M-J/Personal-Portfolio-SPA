import type { SVGProps } from "react";

import { BRAND_MARK_TITLE } from "./siteMetadata";

export type BrandMarkProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  decorative?: boolean;
  title?: string;
};

/**
 * Anand Krishnan's AK monogram. The three CSS variables can be overridden by
 * a parent surface so the same mark stays legible in light and dark themes.
 */
const BrandMark = ({
  decorative = false,
  title = BRAND_MARK_TITLE,
  ...svgProps
}: BrandMarkProps) => {
  return (
    <svg
      {...svgProps}
      width={48}
      height={48}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
      focusable="false"
      data-brand-mark="ak"
    >
      {!decorative && <title>{title}</title>}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="17"
        fill="var(--brand-mark-surface, #f7f1e8)"
        stroke="var(--brand-mark-accent, #a77a50)"
        strokeWidth="1.5"
      />
      <path
        d="M13.75 45.5 24.9 17.8 36.05 45.5M18.3 34.15h13.2"
        stroke="var(--brand-mark-ink, #1b1917)"
        strokeWidth="3.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M37.45 18v27.5"
        stroke="var(--brand-mark-ink, #1b1917)"
        strokeWidth="3.6"
        strokeLinecap="square"
      />
      <path
        d="m38 32.15 12.35-14.1M38 31.9l12.7 13.55"
        stroke="var(--brand-mark-accent, #a77a50)"
        strokeWidth="3.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
};

export default BrandMark;
