import Head from "next/head";

import PortfolioHome from "../components/portfolio/PortfolioHome";
import {
  portfolioStructuredData,
  serializeStructuredData,
} from "../content/selectors";

const serializedStructuredData = serializeStructuredData(
  portfolioStructuredData,
);

const IndexPage = () => (
  <>
    <Head>
      <script
        id="portfolio-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedStructuredData }}
      />
    </Head>
    <PortfolioHome />
  </>
);

export default IndexPage;
