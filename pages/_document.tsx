import Document, { Html, Head, Main, NextScript } from "next/document";

import { siteMetadata } from "../components/portfolio/siteMetadata";

const portfolioThemeBootstrap = `(function(){var theme;try{var saved=localStorage.getItem("portfolio-theme");theme=saved==="light"||saved==="dark"?saved:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");}catch(error){theme=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-portfolio-theme",theme);var meta=document.getElementById("portfolio-theme-color");if(meta){meta.setAttribute("content",theme==="dark"?"#080808":"#fbfaf7");}})();`;

class MyDocument extends Document {
  render() {
    return (
      <Html lang={siteMetadata.htmlLanguage} dir="ltr">
        <Head />
        <body>
          <script
            dangerouslySetInnerHTML={{ __html: portfolioThemeBootstrap }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
