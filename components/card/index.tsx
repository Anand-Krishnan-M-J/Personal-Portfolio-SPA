import { Box, Typography, Button, Grid } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

import { TechUsed } from "../techUsed";
import { useDarkMode } from "../../hooks/useDarkMode";
import { ScrollRight } from "../scrollRight";

import { CardItemProps } from "./card.type";
import classes from "./cardItem.module.scss";

export const Card = ({
  title,
  description,
  techStack,
  image,
  visitGithub,
  visitWebsite,
  slug,
  endpoint,
  isListVariant,
  isPersonalProject,
}: CardItemProps) => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push({
      pathname: `${endpoint}/${slug}`,
    });
  };
  const handleRedirectToWebSite = (redirectTo: string) => {
    if (window) {
      window.open(redirectTo, "_blank");
    }
  };
  const { isDarkMode } = useDarkMode();
  return (
    <Box
      className={classes.card__container}
      sx={{
        display: "flex",
        flexDirection: "column",
        boxShadow: isListVariant ? "0 0 3px grey" : "none",
        userSelect: "none",
      }}
    >
      {isListVariant && (
        <Typography
          component="h2"
          sx={{ fontWeight: "600", fontSize: "x-large", margin: "2rem" }}
        >
          {title}
        </Typography>
      )}
      <Grid
        container
        className={classes.card}
        justifyContent="center"
        sx={{
          padding: "1rem",
        }}
      >
        <Grid
          item
          xs={12}
          lg={3}
          className={classes["card__image--desk"]}
          sx={{
            margin: "1rem",
          }}
        >
          <Box className={classes.card__image}>
            <Image
              className={classes.card__image}
              layout="responsive"
              width={400}
              height={300}
              src={image}
              alt={title}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          lg={8}
          justifyContent="flex-start"
          sx={{
            textAlign: "left",
            margin: "1rem",
            display: "flex",
            marginTop: "1rem",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {!isListVariant && (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  component="h2"
                  sx={{
                    fontWeight: "600",
                    fontSize: "large",
                    marginRight: "1rem",
                  }}
                >
                  {title}
                </Typography>

                <Typography
                  component="p"
                  sx={{
                    fontSize: "large",
                    marginRight: "1rem",
                  }}
                >
                  {isPersonalProject
                    ? " (Personal project)"
                    : "(Organization contribution)"}
                </Typography>
              </Box>
            )}
          </Box>
          <Typography
            className={classes.description}
            sx={{
              marginTop: "1rem",
              textOverflow: "ellipsis",
              color: isDarkMode ? "#a5a5a5" : "#434343",
              lineHeight: 1.7,
            }}
          >
            {description}
          </Typography>
          <Box className={classes.card__tech}>
            <TechUsed techStack={techStack} />
          </Box>
          <Box>
            {visitWebsite && (
              <Button
                variant="outlined"
                onClick={() => handleRedirectToWebSite(visitWebsite)}
                sx={{
                  width: "10rem",
                  margin: "1rem 1rem 0rem 0rem",
                  fontWeight: "600",
                  border: `solid 1px ${isDarkMode ? "#4e4e4e" : "#00000059"}`,
                  color: isDarkMode ? "#a5a5a5" : "#434343",
                  ":hover": {
                    borderColor: "#2753d7",
                  },
                }}
              >
                See Live Demo
              </Button>
            )}
            {visitGithub && (
              <Button
                variant="outlined"
                onClick={() => handleRedirectToWebSite(visitGithub)}
                sx={{
                  width: "10rem",
                  margin: "1rem 1rem 0rem 0rem",
                  fontWeight: "600",
                  border: `solid 1px ${isDarkMode ? "#4e4e4e" : "#00000059"}`,
                  color: isDarkMode ? "#a5a5a5" : "#434343",
                  ":hover": {
                    borderColor: "#2753d7",
                  },
                }}
              >
                Visit Github
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={handleRedirect}
              sx={{
                width: "10rem",
                marginTop: "1rem",
                border: `solid 1px ${isDarkMode ? "#4e4e4e" : "#00000059"}`,
                color: isDarkMode ? "#a5a5a5" : "#434343",
                fontWeight: "600",
                ":hover": {
                  borderColor: "#2753d7",
                },
              }}
            >
              Read More
            </Button>
          </Box>
          <Box
            className={classes.scrollRight}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <ScrollRight />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
