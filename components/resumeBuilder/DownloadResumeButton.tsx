import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import initialCvData from "../../data/cv-data.json";

import CVDocument from "./CVDocument";

interface DownloadResumeButtonProps {
  className?: string;
  isDarkMode?: boolean;
}

const DownloadResumeButton: React.FC<DownloadResumeButtonProps> = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const buttonSx = {
    color: "white",
    marginTop: "1rem",
  };

  if (!isMounted) {
    return (
      <Button variant="contained" sx={buttonSx} disabled>
        Loading...
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<CVDocument data={initialCvData as any} />}
      fileName="Anand_Krishnan_CV.pdf"
      style={{ textDecoration: "none", display: "flex" }}
    >
      {({ loading, error }) => {
        if (error) {
          return (
            <Button variant="contained" sx={buttonSx} disabled>
              Error generating PDF
            </Button>
          );
        }
        return (
          <Button variant="contained" sx={buttonSx} disabled={loading}>
            {loading ? "Generating PDF..." : "Download Resume"}
            {!loading && <DownloadIcon sx={{ marginLeft: "0.5rem" }} />}
          </Button>
        );
      }}
    </PDFDownloadLink>
  );
};

export default DownloadResumeButton;
