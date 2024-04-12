import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Link,
  List,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CircleIcon from "@mui/icons-material/Circle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Parallax } from "react-scroll-parallax";

import { isMobileDevice, joinClass } from "../../../helpers/utils";
import { resume } from "../../../constants";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { homeMessages } from "../../../messages/home";
import { Background } from "../../background";

import classes from "./about.module.scss";

const experience = [
  {
    id: 1,
    institute: "QBurst",
    startDate: "Jan 2024",
    endDate: "Present",
    designation: "Senior Software Engineer",
    worksDone: [
      "Led multiple successful project initiatives by translating client requirements into comprehensive technical specifications.",
      "Contributing significantly to the core frontend team of a multinational fashion retail giant in Japan. Played a crucial role in developing a user-friendly website for over 40 million active users. Introduced new features, fixed numerous bugs, handled several technical debts, and managed smooth releases.",
      "Managed and mentored a team of junior developers from Japan and India to ensure timely and successful project deliveries.",
    ],
  },
  {
    id: 2,
    institute: "QBurst",
    startDate: "Sep 2020",
    endDate: "Dec 2023",
    designation: "Software Engineer",
    worksDone: [
      "Contribute to collaborative development, ensuring seamless user experiences for a multinational fashion retail giant's SPA, serving more than 40 million users and manage CI/CD for production releases, ensuring smooth deployment, and promptly resolving issues.",
      "Uphold high code quality, increasing test coverage from 62% to 85%, resulting in fewer bugs in subsequent releases and refactor code for scalable React architecture, enabling global expansion and adaptability.",
      "Developed proof of concept tools for API visualization, addressing customer-reported issues and actively participate in planning and executing internal tools projects, optimizing build sizes, and ensuring efficient code sharing.",
      "Contributed significantly to internal tools projects, actively engaging in planning, execution, and code review phases. Demonstrated unwavering dedication to fostering efficient code sharing and maintenance practices across the development lifecycle. These applications played a vital role, catering to the diverse needs of over seven different teams within the company.",
    ],
  },
  {
    id: 3,
    institute: "IIT-BHU",
    startDate: "June 2019",
    endDate: "Aug 2019",
    designation: "Trainee",
    worksDone: [
      "Worked on designing, simulating and testing of Meta-Surface based Antennas for radio frequency wireless communication.",
      <span key="pub1">
        One of my first works was approved and published in the{" "}
        <a
          style={{ textDecoration: "underline" }}
          target="blank"
          href="https://www.springerprofessional.de/en/dual-band-fss-backed-printed-antenna-with-fractal-geometry-for-w/18830738"
        >
          {" "}
          7th international conference on Computer and devices for Communication
          (CODEC)
        </a>{" "}
        held on December, 2019
      </span>,
      <span key="pub2">
        Later on I came up with my second prototype and was published in{" "}
        <a
          style={{ textDecoration: "underline" }}
          target="blank"
          href="https://ieeexplore.ieee.org/document/9113517"
        >
          {" "}
          2020 URSI Regional Conference on Radio Science (IEEE)
        </a>
        .
      </span>,
    ],
  },
];
const education = [
  {
    institute: "Graduation",
    startDate: "2016",
    endDate: "2020",
    designation: "Engineering (BTech)",
    organization: "Government Engineering College, Bartonhill, Trivandrum",
    cgpa: "8.55",
  },
  {
    institute: "Higher Secondary",
    startDate: "2013",
    endDate: "2015",
    designation: "Computer Science & Mathematics",
    organization: "Central Board of Secondary Education",
  },
];

export const About = () => {
  const { isDarkMode } = useDarkMode();
  const [experienceTabValue, setExperienceTabValue] = useState(1);
  const [educationTabValue, setEducationTabValue] = useState(0);
  const handleExperienceTabChange = (
    event: React.SyntheticEvent,
    newValue: number,
  ) => {
    setExperienceTabValue(newValue);
  };
  const handleEducationTabChange = (
    event: React.SyntheticEvent,
    newValue: number,
  ) => {
    setEducationTabValue(newValue);
  };

  const currentExperience = experience.find(
    (item) => item.id === experienceTabValue,
  );
  return (
    <Box
      className={joinClass(
        classes.about__container,
        isDarkMode
          ? classes.about__container__dark
          : classes.about__container__light,
      )}
      sx={{
        ...(isDarkMode && {
          border: "solid 1px #2f2f2fc4",
          boxShadow: "0 0 1rem #00000078",
        }),
      }}
    >
      <Background />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "3rem",
          color: isDarkMode ? "#696969" : "#353839aa",
          fontWeight: "800",
        }}
      >
        <Parallax
          {...(!isMobileDevice() && { opacity: [0, 1], translateX: [-50, 1] })}
        >
          <Typography
            sx={{
              fontSize: "large",
              fontWeight: "300",
              color: isDarkMode ? "#ffffffa6" : "#2d2d2d",
            }}
          >
            Check Out My Resume
          </Typography>
        </Parallax>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Parallax
          easing="easeInOut"
          {...(!isMobileDevice() && { opacity: [0.5, 1], translateX: [20, 0] })}
        >
          <Typography
            className={classes.about__title}
            sx={{ fontSize: "3rem", fontWeight: "600", marginBottom: "2rem" }}
          >
            About me
          </Typography>
        </Parallax>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <Box>
          <Typography className={classes.about__hello}>👋</Typography>
        </Box>
        <Box
          sx={{
            margin: "1rem",
            maxWidth: "800px",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ marginBottom: "1rem" }}>
            {homeMessages.aboutPara1}
          </Typography>
          <Typography>{homeMessages.aboutPara2}</Typography>
        </Box>
      </Box>
      <Box sx={{ width: "100%", padding: "1.5rem" }}>
        <Box sx={{ width: "100%" }}>
          <Box
            className={classes["experience--desktop"]}
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              maxWidth: "1200px",
              margin: "auto",
            }}
          >
            <Typography
              sx={{
                fontSize: "xx-large",
                fontWeight: "600",
              }}
            >
              Work Experience
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Tabs
                orientation="vertical"
                value={experienceTabValue}
                onChange={handleExperienceTabChange}
                TabIndicatorProps={{ style: { width: "2px" } }}
                sx={{
                  ".MuiTabs-indicator": {
                    left: 0,
                  },
                  margin: "1rem",
                  borderLeft: `solid 1px ${
                    isDarkMode ? "#696969" : "#353839aa"
                  }`,
                }}
              >
                {experience.map((item, index) => (
                  <Tab
                    key={`expTab-${index}`}
                    sx={{
                      minWidth: "1rem",
                      color: isDarkMode ? "#696969" : "#353839aa",
                      textTransform: "none",
                      fontWeight: "600",
                      textAlign: "left",
                    }}
                    value={item.id}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          position: "relative",
                        }}
                      >
                        <Typography fontSize={"1.1rem"} fontWeight="600">
                          {item.designation}
                        </Typography>
                        <Typography>{item.institute}</Typography>
                      </Box>
                    }
                  />
                ))}
              </Tabs>
              {
                <Box sx={{ maxWidth: "70%", marginTop: "1rem" }}>
                  <List sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      sx={{ marginTop: "0.2rem", marginBottom: "1rem" }}
                    >{`${currentExperience?.startDate} - ${currentExperience?.endDate}`}</Typography>

                    {currentExperience?.worksDone.map((item, index) => (
                      <Box
                        key={`expListTab-${index}`}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "flex-start",
                        }}
                      >
                        <ListItemIcon>
                          <CircleIcon
                            sx={{
                              width: "0.9rem",
                              color: isDarkMode ? "#696969" : "#353839aa",
                              marginTop: "0.5rem",
                            }}
                            fontSize="small"
                          />
                        </ListItemIcon>
                        <ListItemText
                          sx={{ marginLeft: "-1rem" }}
                          primary={item}
                        />
                      </Box>
                    ))}
                  </List>
                </Box>
              }
            </Box>
          </Box>
          <Box className={classes["experience--mobile"]}>
            <Typography
              className={classes.experience__title}
              sx={{
                margin: "0rem 0rem 1rem 0rem",
                fontSize: "2rem",
                fontWeight: 600,
              }}
            >
              Work Experience
            </Typography>
            {experience.map((item, index) => (
              <Box key={`expMobTab-${index}`}>
                <Accordion
                  sx={{
                    backgroundColor: isDarkMode ? "#29292930" : "#a1cdff1c",
                    boxShadow: "0rem 0rem 0.1rem grey",
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon
                        sx={{
                          color: isDarkMode ? "#a1a1a1" : "",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      />
                    }
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ color: "inherit" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "600",
                          fontSize: "1.2rem",
                          color: isDarkMode ? "#a1a1a1" : "",
                        }}
                      >
                        {`${item.designation}`}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: "500",
                          fontSize: "0.9rem",
                          color: isDarkMode ? "#a1a1a1" : "#353839aa",
                        }}
                      >
                        {item.institute} ({item?.startDate} - {item?.endDate})
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {item.worksDone.map((item, index) => (
                        <Box
                          key={`expMobListTab-${index}`}
                          sx={{ display: "flex", flexDirection: "row" }}
                        >
                          <ListItemIcon>
                            <CircleIcon
                              sx={{
                                width: "0.8rem",
                                color: isDarkMode ? "#a1a1a1" : "",
                                marginTop: "0.5rem",
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            sx={{
                              color: isDarkMode ? "#a1a1a1" : "",
                              marginLeft: "-1.5rem",
                            }}
                            primary={item}
                          />
                        </Box>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Box
              className={classes["experience--desktop"]}
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                maxWidth: "1200px",
                flexDirection: "column",
                margin: "auto",
                marginTop: "1.5rem",
              }}
            >
              <Typography
                sx={{
                  fontSize: "xx-large",
                  fontWeight: "600",
                }}
              >
                Education
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Tabs
                  orientation="vertical"
                  value={educationTabValue}
                  onChange={handleEducationTabChange}
                  TabIndicatorProps={{ style: { width: "2px" } }}
                  sx={{
                    ".MuiTabs-indicator": {
                      left: 0,
                    },
                    margin: "1rem",
                    borderLeft: `solid 1px ${
                      isDarkMode ? "#696969" : "#353839aa"
                    }`,
                  }}
                >
                  {education.map((item, index) => (
                    <Tab
                      key={`eduTabDesk-${index}`}
                      sx={{
                        minWidth: "1rem",
                        width: "8rem",
                        fontSize: "1.1rem",
                        textTransform: "none",
                        fontWeight: "600",
                        color: isDarkMode ? "#696969" : "#353839aa",
                      }}
                      label={item.institute}
                    />
                  ))}
                </Tabs>
                {
                  <Box
                    sx={{
                      maxWidth: "70%",
                      marginLeft: "2rem",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box>
                      <Typography
                        component="h2"
                        fontWeight="600"
                        fontSize="1.5rem"
                      >
                        {education[educationTabValue].designation}
                      </Typography>
                    </Box>

                    <Typography sx={{ fontWeight: 600 }}>
                      {education[educationTabValue].organization}
                    </Typography>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography sx={{ marginTop: "0.2rem" }}>
                        {`${education[educationTabValue].startDate} - ${education[educationTabValue].endDate}`}
                      </Typography>
                      <Typography sx={{ marginTop: "0.2rem" }}>
                        {education[educationTabValue].cgpa &&
                          `CGPA score - ${education[educationTabValue].cgpa}`}
                      </Typography>
                    </Box>
                  </Box>
                }
              </Box>
            </Box>
          </Box>
          <Box
            sx={{ marginTop: "1.5rem" }}
            className={classes["experience--mobile"]}
          >
            <Typography
              className={classes.experience__title}
              sx={{
                margin: "0rem 0rem 1rem 0rem",
                fontSize: "2rem",
                fontWeight: 600,
              }}
            >
              Education
            </Typography>
            {education.map((item, index) => (
              <Accordion
                key={`edu-${index}`}
                sx={{
                  backgroundColor: isDarkMode ? "#29292930" : "#a1cdff1c",
                  boxShadow: "0rem 0rem 0.1rem grey",
                  color: isDarkMode ? "#a1a1a1" : "",
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        color: isDarkMode ? "#a1a1a1" : "",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    />
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  sx={{ color: "inherit" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "600",
                        fontSize: "1.2rem",
                      }}
                    >
                      {`${item.designation}`}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: "500",
                        fontSize: "0.9rem",
                        color: isDarkMode ? "#a1a1a1" : "#353839aa",
                      }}
                    >
                      {item.institute} ({item?.startDate} - {item?.endDate})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{item.organization}</Typography>
                  {item.cgpa && (
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        minWidth: "6rem",
                        color: isDarkMode ? "#a1a1a1" : "#353839aa",
                      }}
                    >
                      CGPA: {item.cgpa}
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
        <Box
          sx={{ display: "flex", marginTop: "2rem", justifyContent: "center" }}
        >
          <Link
            sx={{
              color: isDarkMode ? "white" : "black",
              textDecoration: "none",
            }}
            href={resume}
            target="_blank"
          >
            <Button
              variant="contained"
              sx={{ color: "white", marginBottom: "3rem" }}
            >
              Download Resume
              <DownloadIcon sx={{ marginLeft: "0.5rem" }} />
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
