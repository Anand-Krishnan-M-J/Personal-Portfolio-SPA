import React, { useContext } from "react";
import { Box, Link, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";

import { homeMessages } from "../../../messages/home";
import { DarKModeContext } from "../../layout/layout";
import { ProfileCard } from "../../profileCard";
import { joinClass } from "../../../helpers/utils";
import DownloadResumeButton from "../../resumeBuilder/DownloadResumeButton";

import classes from "./home.module.scss";

export const Home = () => {
  const { isDarkMode, darkModeIsloading } = useContext(DarKModeContext);
  return (
    <Box
      className={joinClass(
        classes.intro__container,
        (!darkModeIsloading &&
          (isDarkMode
            ? classes.intro__container__dark
            : classes.intro__container__light)) ||
          "",
      )}
    >
      <ProfileCard />
      <div className={classes.intro__content}>
        {!darkModeIsloading && (
          <h2
            className={
              isDarkMode
                ? classes["intro__self--dark"]
                : classes["intro__self--light"]
            }
          >
            {homeMessages.anand}
            <span className={classes.line}></span>
          </h2>
        )}
        <div className={classes.slider__wrapper}>
          <div className={classes.slider}>
            <h2 className={classes.slider__text1}>
              {homeMessages.SOFTWARE_ENGINEER}
            </h2>
            <h2 className={classes.slider__text2}>
              {homeMessages.FULLSTACK_DEVELOPER}
            </h2>
            <h2 className={classes.slider__text3}>
              {homeMessages.Passionate_Mentor}
            </h2>
          </div>
        </div>

        <div className={classes.intro__horizontalSeparation} />
        <Typography className={classes.intro__description}>
          {homeMessages.intro}
        </Typography>

        <Box
          className={classes.intro__links}
          sx={{
            display: "flex",
            marginTop: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Link
            sx={{ margin: "0.5rem", color: isDarkMode ? "white" : "black" }}
            href="mailto:anandkrishmj@gmail.com"
          >
            <EmailIcon sx={{ fontSize: "2rem" }} />
          </Link>

          <Link
            sx={{ margin: "0.5rem", color: isDarkMode ? "white" : "black" }}
            href="https://twitter.com/ANANDKRISHNAN6"
            target="_blank"
          >
            <TwitterIcon sx={{ fontSize: "2rem" }} />
          </Link>
          <Link
            sx={{ margin: "0.5rem", color: isDarkMode ? "white" : "black" }}
            href="https://www.linkedin.com/in/anand-krishnan-mj"
            target="_blank"
          >
            <LinkedInIcon sx={{ fontSize: "2rem" }} />
          </Link>
          <Link
            sx={{ margin: "0.5rem", color: isDarkMode ? "white" : "black" }}
            href="https://www.facebook.com/anandkrishnan.anandkrishnan"
            target="_blank"
          >
            <FacebookIcon sx={{ fontSize: "2rem" }} />
          </Link>
          <Link
            sx={{ margin: "0.5rem", color: isDarkMode ? "white" : "black" }}
            href="https://github.com/Anand-Krishnan-M-J"
            target="_blank"
          >
            <GitHubIcon sx={{ fontSize: "2rem" }} />
          </Link>
        </Box>
        <Box
          className={classes.intro__button__container}
          sx={{
            display: "flex",
            justifyContent: {
              xs: "center", // center on mobile
              md: "flex-start", // left on desktop
            },
          }}
        >
          <DownloadResumeButton isDarkMode={isDarkMode} />
        </Box>
      </div>
    </Box>
  );
};
