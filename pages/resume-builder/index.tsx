import React, { useState, useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

import CVDocument from "../../components/resumeBuilder/CVDocument";
import initialCvData from "../../data/cv-data.json";

import styles from "./index.module.scss";

// Dynamically import Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div style={{ color: "#666", padding: 20 }}>Loading editor...</div>
  ),
});

const defaultJson = JSON.stringify(initialCvData, null, 2);

interface CVData {
  personalInfo?: {
    name?: string;
    title?: string;
    experience?: string;
    location?: string;
    phone?: string;
    email?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  about?: {
    title?: string;
    description?: string;
  };
  technicalExpertise?: string[];
  skills?: string[];
  methodology?: string[];
  tools?: string[];
  experience?: Array<{
    company?: string;
    companyPeriod?: string;
    roles?: Array<{
      position?: string;
      period?: string;
      responsibilities?: string[];
    }>;
  }>;
  openSource?: {
    title?: string;
    subtitle?: string;
    contributions?: string[];
  };
  education?: {
    degree?: string;
    period?: string;
    field?: string;
    institution?: string;
    location?: string;
    grade?: string;
  };
  projects?: Array<{
    name?: string;
    description?: string;
    details?: string[];
  }>;
}

const ResumeBuilder: React.FC = () => {
  const [jsonString, setJsonString] = useState<string>(defaultJson);
  const [parseError, setParseError] = useState<string | null>(null);
  const [lastValidData, setLastValidData] = useState<CVData>(
    initialCvData as CVData,
  );
  const [isMounted, setIsMounted] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cvData = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonString) as CVData;
      setParseError(null);
      setLastValidData(parsed);
      return parsed;
    } catch (e: any) {
      setParseError(e.message);
      return null;
    }
  }, [jsonString]);

  const handleEditorChange = (value: string | undefined) => {
    setJsonString(value || "");
  };

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <h1>CV Generator</h1>
        {isMounted && (
          <PDFDownloadLink
            document={<CVDocument data={cvData || (initialCvData as CVData)} />}
            fileName="Anand_Krishnan_CV.pdf"
            className={styles.downloadButton}
          >
            {({ loading, error }) => {
              if (error) {
                return "Error generating PDF";
              }
              return loading ? "Loading document..." : "Download PDF";
            }}
          </PDFDownloadLink>
        )}
      </div>
      <div className={styles.mainContent}>
        <div className={styles.editorPanel}>
          <div className={styles.editorHeader}>
            <span>CV Data (JSON)</span>
            {parseError && (
              <span className={styles.errorBadge}>Invalid JSON</span>
            )}
          </div>
          <div className={styles.editorWrapper}>
            {isMounted && (
              <Editor
                height="calc(100vh - 120px)"
                defaultLanguage="json"
                value={jsonString}
                onChange={handleEditorChange}
                onMount={handleEditorMount}
                theme="light"
                loading={
                  <div style={{ color: "#666", padding: 20 }}>
                    Loading editor...
                  </div>
                }
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  wordWrap: "on",
                  formatOnPaste: true,
                  formatOnType: true,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                }}
              />
            )}
          </div>
          {parseError && (
            <div className={styles.errorMessage}>
              <strong>Parse Error:</strong> {parseError}
            </div>
          )}
        </div>
        <div className={styles.pdfContainer}>
          <div className={styles.pdfWrapper}>
            {parseError && (
              <div className={styles.pdfOverlay}>
                <div className={styles.pdfOverlayContent}>
                  <span className={styles.warningIcon}>⚠️</span>
                  <span>Invalid JSON - Showing last valid preview</span>
                </div>
              </div>
            )}
            {isMounted && (
              <PDFViewer
                className={styles.pdfViewer}
                width="100%"
                height="100%"
              >
                <CVDocument data={cvData || lastValidData} />
              </PDFViewer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
