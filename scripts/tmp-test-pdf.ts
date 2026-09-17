import React from "react";
import { pdf } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import { createPortfolioDownloadCustomization } from "../components/resumeBuilder/resumeLayout";
import { PortfolioDownloadDocument } from "../components/resumeBuilder/templates/ClassicDocuments";
import { resumeData } from "../content/runtime";

async function main() {
  try {
    const document = React.createElement(PortfolioDownloadDocument, {
      customization: createPortfolioDownloadCustomization(),
      data: resumeData,
    });
    const blob = await pdf(
      document as React.ReactElement<DocumentProps>,
    ).toBlob();
    console.log("OK", blob.size);
  } catch (e) {
    console.error("FAIL", e);
  }
}

void main();
