import React from "react";
import Image from "next/image";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { Parallax } from "react-scroll-parallax";

import { isMobileDevice, joinClass } from "../../../helpers/utils";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { Background } from "../../background";
import skills from "../../../constants/skills";

import classes from "./skills.module.scss";

export const Skills = () => {
  const { isDarkMode } = useDarkMode();
  const [value, setValue] = React.useState(0);
  /* eslint-disable */
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      className={joinClass(
        classes.skills__container,
        isDarkMode
          ? classes.skills__container__dark
          : classes.skills__container__light
      )}
      sx={{
        position: "relative",
        borderRadius: "1rem",
        backgroundColor: isDarkMode ? "#ffffff04" : "",
        ...(isDarkMode && {
          border: "solid 1px #2f2f2fc4",
          boxShadow: "0 0 1rem #00000078",
        }),
      }}
    >
      <Background />

      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}
        className={classes.shortDescription}
      >
        <Parallax
          easing={"easeInOut"}
          {...(!isMobileDevice() && {
            opacity: [0.3, 1],
            translateX: [-50, 1],
          })}
        >
          <Typography
            sx={{
              fontSize: "large",
              fontWeight: "300",
              color: isDarkMode ? "#ffffffa6" : "#2d2d2d",
            }}
          >
            Things that I am good at
          </Typography>
        </Parallax>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Parallax
          easing="easeInOut"
          {...(!isMobileDevice() && { opacity: [0.5, 1], translateX: [20, 1] })}
        >
          <Typography
            className={classes.skills__title}
            sx={{ fontSize: "3rem", fontWeight: "600", marginBottom: "2rem" }}
          >
            My Skills
          </Typography>
        </Parallax>
      </Box>

      <Box
        className={classes.skills__content__wrapper}
        sx={{
          borderRadius: "1rem",
          minHeight: "45vh",
        }}
      >
        <Tabs
          className={classes.skill__tab}
          TabIndicatorProps={{
            style: {
              backgroundColor: "#2753d7",
              boxShadow: "0px 0px 3rem #2753d7",
            },
          }}
          centered
          selectionFollowsFocus
          sx={{ width: "100%" }}
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          scrollButtons={false}
          aria-label="scrollable prevent tabs example"
        >
          {skills.map((skill) => (
            <Tab
              key={skill.tabLabel}
              label={
                <Typography
                  sx={{
                    color: isDarkMode ? "white" : "rgb(49, 49, 49)",
                    fontWeight: "600",
                  }}
                >
                  {skill.tabLabel}
                </Typography>
              }
            />
          ))}
        </Tabs>
        <Box
          className={classes.skills__content}
          sx={{
            display: "flex",
            padding: "1rem",
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "center",
            gap: "3px",
          }}
        >
          {skills[value].items.map((item) => (
            <Box
              key={item.skillLabel}
              sx={{
                width: "100px",
                padding: "0.5rem",
                border: `solid 1px ${isDarkMode ? "#7979797d" : "#0000002e"}`,
              }}
            >
              <div className={classes.skills__image__desk}>
                <Image
                  src={item.src}
                  alt={item.skillLabel}
                  width={70}
                  height={70}
                  loading="eager"
                />
              </div>
              <div className={classes.skills__image__mobile}>
                <Image
                  src={item.mobileSrc}
                  alt={item.skillLabel}
                  width={80}
                  height={80}
                  loading="eager"
                />
              </div>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                {item.skillLabel}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
