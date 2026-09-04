import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import {
  PRIVATE_ROBOTS_DIRECTIVE,
  SITE_NAME,
} from "../components/portfolio/siteMetadata";

import styles from "./404.module.scss";

const NotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`Page Not Found | ${SITE_NAME}`}</title>
        <meta key="robots" name="robots" content={PRIVATE_ROBOTS_DIRECTIVE} />
        <meta
          key="googlebot"
          name="googlebot"
          content={PRIVATE_ROBOTS_DIRECTIVE}
        />
      </Head>
      <main className={styles.container}>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          The page you are looking for does not exist.
        </p>
        <Link className={styles.link} href="/">
          Go back to the homepage
        </Link>
      </main>
    </>
  );
};

export default NotFound;
