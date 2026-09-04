import generatedMetadata from "../../content/site-metadata.generated.json";

/** Lightweight client metadata generated from the validated content config. */
export const siteMetadata = generatedMetadata;
export const SITE_URL = generatedMetadata.siteUrl;
export const SITE_HOME_URL = generatedMetadata.homeUrl;
export const SITE_NAME = generatedMetadata.siteName;
export const SITE_TITLE = generatedMetadata.title;
export const SITE_DESCRIPTION = generatedMetadata.description;
export const BRAND_MARK_TITLE = generatedMetadata.brandMarkTitle;
export const SOCIAL_IMAGE_URL = generatedMetadata.socialImageUrl;
export const SOCIAL_IMAGE_ALT = generatedMetadata.socialImageAlt;
export const PROFILE_IMAGE_URL = generatedMetadata.profileImageUrl;
export const SOCIAL_PROFILE_URLS = generatedMetadata.socialProfileUrls;

export const canonicalUrlForPath = (asPath: string) => {
  const pathname = asPath.split(/[?#]/)[0] || "/";
  const rootedPath = `/${pathname.replace(/^\/+/, "")}`;
  const normalizedPath =
    rootedPath === "/" ? rootedPath : rootedPath.replace(/\/+$/, "");
  return `${SITE_URL}${normalizedPath}`;
};

export const PUBLIC_ROBOTS_DIRECTIVE =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

export const PRIVATE_ROBOTS_DIRECTIVE =
  "noindex, nofollow, noarchive, nosnippet, noimageindex";

export const isPrivatePath = (pathname: string) =>
  pathname === "/404" ||
  pathname.startsWith("/resume-builder") ||
  pathname.startsWith("/api");
