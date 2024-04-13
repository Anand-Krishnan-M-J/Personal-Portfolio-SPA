import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

import { useDarkMode } from "../../hooks/useDarkMode";

import styles from "./styles.module.scss";

const RoundCursor: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateCursorPosition);

    return () => {
      window.removeEventListener("mousemove", updateCursorPosition);
    };
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: isDarkMode
          ? "rgba(247, 247, 247, 0.5)"
          : "rgba(247, 247, 247, 1)",
        boxShadow: isDarkMode
          ? "0rem 0rem 10rem 3rem rgba(227, 227, 227, 0.35)"
          : "0rem 0rem 10rem 5rem rgba(255, 255, 255, 0.2)",
      }}
      className={styles["round-cursor"]}
      style={{ left: cursorPosition.x, top: cursorPosition.y }}
    ></Box>
  );
};

export default RoundCursor;
