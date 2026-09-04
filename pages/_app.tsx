import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  canonicalUrlForPath,
  isPrivatePath,
  PRIVATE_ROBOTS_DIRECTIVE,
  PUBLIC_ROBOTS_DIRECTIVE,
  siteMetadata,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SOCIAL_IMAGE_ALT,
  SOCIAL_IMAGE_URL,
  SOCIAL_PROFILE_URLS,
} from "../components/portfolio/siteMetadata";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const privatePage = isPrivatePath(router.pathname);
  const canonicalUrl = canonicalUrlForPath(router.asPath);

  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta key="description" name="description" content={SITE_DESCRIPTION} />
        <meta name="author" content={siteMetadata.author} />
        <meta name="application-name" content={siteMetadata.applicationName} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta
          key="robots"
          name="robots"
          content={
            privatePage ? PRIVATE_ROBOTS_DIRECTIVE : PUBLIC_ROBOTS_DIRECTIVE
          }
        />
        <meta
          name="googlebot"
          content={
            privatePage ? PRIVATE_ROBOTS_DIRECTIVE : PUBLIC_ROBOTS_DIRECTIVE
          }
        />
        {!privatePage && (
          <>
            <meta key="og-title" property="og:title" content={SITE_TITLE} />
            <meta
              key="og-description"
              property="og:description"
              content={SITE_DESCRIPTION}
            />
            <meta key="og-type" property="og:type" content="website" />
            <meta
              key="og-locale"
              property="og:locale"
              content={siteMetadata.openGraphLocale}
            />
            <meta
              key="og-site-name"
              property="og:site_name"
              content={SITE_NAME}
            />
            <meta key="og-url" property="og:url" content={canonicalUrl} />
            <meta
              key="og-image"
              property="og:image"
              content={SOCIAL_IMAGE_URL}
            />
            <meta
              key="og-image-secure-url"
              property="og:image:secure_url"
              content={SOCIAL_IMAGE_URL}
            />
            <meta
              key="og-image-type"
              property="og:image:type"
              content={siteMetadata.socialImageType}
            />
            <meta
              key="og-image-width"
              property="og:image:width"
              content={String(siteMetadata.socialImageWidth)}
            />
            <meta
              key="og-image-height"
              property="og:image:height"
              content={String(siteMetadata.socialImageHeight)}
            />
            <meta
              key="og-image-alt"
              property="og:image:alt"
              content={SOCIAL_IMAGE_ALT}
            />
            <meta
              key="twitter-card"
              name="twitter:card"
              content="summary_large_image"
            />
            <meta
              key="twitter-title"
              name="twitter:title"
              content={SITE_TITLE}
            />
            <meta
              key="twitter-description"
              name="twitter:description"
              content={SITE_DESCRIPTION}
            />
            <meta key="twitter-url" name="twitter:url" content={canonicalUrl} />
            <meta
              key="twitter-image"
              name="twitter:image"
              content={SOCIAL_IMAGE_URL}
            />
            <meta
              key="twitter-image-alt"
              name="twitter:image:alt"
              content={SOCIAL_IMAGE_ALT}
            />
            <link key="canonical" rel="canonical" href={canonicalUrl} />
            {SOCIAL_PROFILE_URLS.map((profileUrl) => (
              <link key={`identity-${profileUrl}`} rel="me" href={profileUrl} />
            ))}
          </>
        )}
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/brand-mark.svg" type="image/svg+xml" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="mask-icon" href="/brand-mark.svg" color="#a77a50" />
        <meta name="msapplication-TileColor" content="#a77a50" />
        <meta name="msapplication-TileImage" content="/mstile-150x150.png" />
        <meta name="color-scheme" content="light dark" />
        <meta id="portfolio-theme-color" name="theme-color" content="#fbfaf7" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
