import { Box, Grid } from "@mui/material";
import { Parallax } from "react-scroll-parallax";
import { useInView } from "react-intersection-observer";

import { isMobileDevice } from "../../../helpers/utils";
import MiniLogo from "../../miniLogo";
import { Background } from "../../background";

import classes from "./quote.module.scss";

const quote = `" There are no limits to what you can do or heal, as long as you believe. "`;

export const Quotes = () => {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Background />
      <Grid
        container
        justifyContent={"center"}
        alignItems="center"
        sx={{ maxWidth: "1400px" }}
      >
        <Grid item xs={12} md={7}>
          <div ref={ref} className={classes.quote__container}>
            {inView && (
              <h3 className={classes.quote__content}>
                {quote.split(" ").map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className={classes.quote__each}
                  >
                    {word}
                  </span>
                ))}
              </h3>
            )}
          </div>
        </Grid>
        <Grid
          className={classes.miniLogoContainer}
          item
          xs={5}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <Parallax
            easing="easeInOut"
            {...(!isMobileDevice() && {
              opacity: [0.5, 1],
              translateX: [70, 0],
            })}
          >
            <MiniLogo />
          </Parallax>
        </Grid>
      </Grid>
    </Box>
  );
};
