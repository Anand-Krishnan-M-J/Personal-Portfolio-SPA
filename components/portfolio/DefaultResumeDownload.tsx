import React, { useState } from "react";
import type { DocumentProps } from "@react-pdf/renderer";

import {
  defaultResumeFileName,
  homepageCopy,
  resumeData,
} from "../../content/selectors";

type DefaultResumeDownloadProps = {
  className?: string;
  compact?: boolean;
};

let cachedResumeUrl: string | null = null;
let resumeGeneration: Promise<string> | null = null;

const getDefaultResumeUrl = () => {
  if (cachedResumeUrl) return Promise.resolve(cachedResumeUrl);

  if (!resumeGeneration) {
    resumeGeneration = Promise.all([
      import("@react-pdf/renderer"),
      import("../resumeBuilder/resumeLayout"),
      import("../resumeBuilder/templates/ClassicDocuments"),
    ])
      .then(
        async ([
          { pdf },
          { createPortfolioDownloadCustomization },
          { PortfolioDownloadDocument },
        ]) => {
          const document = React.createElement(PortfolioDownloadDocument, {
            customization: createPortfolioDownloadCustomization(),
            data: resumeData,
          });
          const blob = await pdf(
            document as React.ReactElement<DocumentProps>,
          ).toBlob();
          cachedResumeUrl = URL.createObjectURL(blob);
          return cachedResumeUrl;
        },
      )
      .catch((error) => {
        resumeGeneration = null;
        throw error;
      });
  }

  return resumeGeneration;
};

const triggerDownload = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = defaultResumeFileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const DefaultResumeDownload = ({
  className,
  compact = false,
}: DefaultResumeDownloadProps) => {
  const { hero } = homepageCopy;
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const downloadResume = async () => {
    setLoading(true);
    setFailed(false);

    try {
      triggerDownload(await getDefaultResumeUrl());
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const label = failed
    ? hero.resumeFailedLabel
    : loading
      ? compact
        ? hero.resumePreparingCompactLabel
        : hero.resumePreparingLabel
      : hero.resumeDefaultLabel;
  const accessibleLabel =
    failed || loading ? label : `${label} — ${hero.resumeAriaLabel}`;

  return (
    <button
      aria-label={accessibleLabel}
      className={className}
      disabled={loading}
      onClick={downloadResume}
      type="button"
    >
      {label}
    </button>
  );
};

export default DefaultResumeDownload;
