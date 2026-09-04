import { usePDF } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import React, { useMemo } from "react";

import { getResumeDocumentComponent } from "./templates/registry";
import type { CVData, ResumeCustomization } from "./types";

type ResumePdfProps = {
  customization: ResumeCustomization;
  data: CVData;
  templateId: string;
};

export type ResumePdfState = {
  error: string | null;
  loading: boolean;
  url: string | null;
};

type ResumePdfProviderProps = ResumePdfProps & {
  children: (state: ResumePdfState) => React.ReactNode;
};

const useResumeDocument = ({
  customization,
  data,
  templateId,
}: ResumePdfProps) =>
  useMemo(() => {
    const ResumeDocument = getResumeDocumentComponent(templateId);
    return React.createElement(ResumeDocument, {
      customization,
      data,
    }) as React.ReactElement<DocumentProps>;
  }, [customization, data, templateId]);

export const ResumePdfProvider = ({
  children,
  customization,
  data,
  templateId,
}: ResumePdfProviderProps) => {
  const document = useResumeDocument({
    customization,
    data,
    templateId,
  });
  const [instance] = usePDF({ document });

  return children({
    error: instance.error ? String(instance.error) : null,
    loading: instance.loading,
    url: instance.url,
  });
};
