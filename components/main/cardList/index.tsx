import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Parallax } from "react-scroll-parallax";
import Image from "next/image";

import { isMobileDevice, joinClass } from "../../../helpers/utils";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { Card } from "../../card";
import { Background } from "../../background";

import classes from "./blogs.module.scss";

const viewMore = ` Embark on my career journey with me and discover what's next! Check out what's currently in the works and beyond by clicking below.`;

interface Blog {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
  slug: string;
  content: string;
  techStack: string[];
}

interface CardListProps {
  type: string;
  description: string;
  title: string;
  data: Blog[];
  sectionMapping: number;
}

export const CardList = ({ type, description, title, data }: CardListProps) => {
  const { isDarkMode } = useDarkMode();

  return (
    <Box
      className={joinClass(
        classes.blogs__container,
        isDarkMode
          ? classes.blogs__container__dark
          : classes.blogs__container__light,
      )}
      sx={{
        overflow: "hidden",
        /* eslint-disable */
        ...(isDarkMode && {
          border: "solid 1px #2f2f2fc4",
          boxShadow: "0 0 1rem #00000078",
        }),
      }}
    >
      <Background />
      <Box
        sx={{
          marginTop: "3rem",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            color: isDarkMode ? "#696969" : "#353839aa",
            fontWeight: 800,
          }}
        >
          <Parallax
            easing="easeInOut"
            {...(!isMobileDevice() && {
              opacity: [0.5, 1],
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
              {description}
            </Typography>
          </Parallax>
        </Box>
        <Box component="span" sx={{ margin: "auto" }}>
          <Parallax
            easing="easeInOut"
            {...(!isMobileDevice() && {
              opacity: [0.5, 1],
              translateX: [20, 1],
            })}
          >
            <Typography
              className={classes.blogs__title}
              sx={{ fontSize: "3rem", fontWeight: "600", marginBottom: "2rem" }}
            >
              {title}
            </Typography>
          </Parallax>
        </Box>
      </Box>
      <Box sx={{ width: "90%" }}>
        <Carousel
          className={classes.carousel}
          verticalSwipe="standard"
          useKeyboardArrows
          showArrows
          emulateTouch
          preventMovementUntilSwipeScrollTolerance={true}
          swipeScrollTolerance={50}
          axis="horizontal"
          centerMode
          centerSlidePercentage={100}
        >
          {
            data?.map((blog, index) => (
              <Box key={`title:${blog.title}-${index}`}>
                <Card {...blog} endpoint={type} />
              </Box>
            )) as any
          }
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              cursor: "grab",
              userSelect: "none",
            }}
          >
            <Box
              sx={{
                maxWidth: "100%",
              }}
            >
              <Image
                width={320}
                height={300}
                src="/images/more.png"
                alt="view More"
              />
            </Box>
            <Box sx={{ width: "450px", maxWidth: "100%", padding: "2rem" }}>
              <Typography sx={{ margin: "1rem", textAlign: "left" }}>
                {viewMore}
              </Typography>
              <Button variant="contained">
                <Link href="/projects">View More</Link>
              </Button>
            </Box>
          </Box>
        </Carousel>
      </Box>
    </Box>
  );
};
