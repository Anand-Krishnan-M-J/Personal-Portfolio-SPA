import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import store from "../store";
import "../components/layout/layout.css";
import "../components/main/cardList/cardArrow.css";
import "../styles/globals.css";
import { Loading } from "../components/Loading";
import { useSsrPageLoading } from "../hooks/useIsSsrPageLoading";

function MyApp({ Component, pageProps }: AppProps) {
  const { isLoading } = useSsrPageLoading();
  return (
    <>
      <Head>
        <title>Anand Krishnan M J Portfolio - Full Stack Developer</title>
        <meta
          name="description"
          content="Anand Krishnan M J is a Full Stack Developer with expertise in React.js, Node.js, Express.js, PostgreSQL, Docker and Next.js."
        />
        <meta
          name="keywords"
          content="Anand Krishnan M J, Portfolio, Full Stack Developer, React.js, Node.js, Express.js, PostgreSQL, Next.js, Docker"
        />
        <meta name="author" content="Anand Krishnan M J" />
        <meta
          property="og:title"
          content="Anand Krishnan M J Portfolio - Full Stack Developer"
        />
        <meta
          property="og:description"
          content="Anand Krishnan M J is a Full Stack Developer with expertise in React.js, Node.js, and Next.js."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.anandkris.com" />
        <meta
          property="og:image"
          content="https://drive.google.com/uc?export=view&id=1jmAPu8YWqt5mSQFZLqDjeCThv-G0XG1z"
        />
        <meta
          property="og:image:alt"
          content="Anand Krishnan M J Portfolio - Full Stack Developer"
        />
        <meta
          name="twitter:title"
          content="Anand Krishnan M J Portfolio - Full Stack Developer"
        />
        <meta
          name="twitter:description"
          content="Anand Krishnan M J is a Full Stack Developer with expertise in React.js, Node.js, and Next.js."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://drive.google.com/uc?export=view&id=1jmAPu8YWqt5mSQFZLqDjeCThv-G0XG1z"
        />
        <link rel="canonical" href="https://www.anandkris.com" />
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
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff"></meta>
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {isLoading && <Loading />}
      <Provider store={store}>
        {/* eslint-disable  */}
        <Component {...pageProps} />
      </Provider>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default MyApp;
