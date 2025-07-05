import React, { useEffect, useRef } from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import { useDispatch, useSelector } from "react-redux";

import Layout from "../components/layout/layout";
import { Home } from "../components/main/home";
import { Quotes } from "../components/main/quotes";
import { CardList } from "../components/main/cardList";
import { Contact } from "../components/main/contact";
import { About } from "../components/main/about";
import { Skills } from "../components/main/skills";
import { getBlogs } from "../store/blogs/reducer";
import { Background } from "../components/background";
import { sectionMapping } from "../components/main/sectionMapping";
import { RootState } from "../store/types";
import { getProjects, projectStateType } from "../store/projects/reducer";
import withScrollToPosition from "../hoc/scrollManager";

import classes from "./index.module.scss";

export const TabContext = React.createContext({
  tabValue: 0,
  /* eslint-disable */
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => {},
});

const Main = () => {
  const [tabValue, settabValue] = React.useState(0);

  const homeRef = useRef(null);
  const portfolioRef = useRef(null);
  // const blogRef = useRef(null);
  const contactRef = useRef(null);
  const aboutRef = useRef(null);
  const skillRef = useRef(null);
  const refMap: any = {
    0: homeRef,
    1: portfolioRef,
    // 2: blogRef,
    2: aboutRef,
    3: skillRef,
    4: contactRef,
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    settabValue(newValue);
    refMap[newValue]?.current?.scrollIntoView();
  };

  const dispatch = useDispatch();
  const { projects, isProjectLoading } = useSelector<RootState>(
    (state) => state.project
  ) as projectStateType;

  useEffect(() => {
    dispatch(getBlogs({ showHidden: false, limit: 5, offset: 0 }));
    dispatch(getProjects({ showHidden: false, limit: 5, offset: 0 }));
  }, []);

  return (
    <ParallaxProvider>
      <div className={classes["section__container"]}>
        {!isProjectLoading ? (
          <TabContext.Provider value={{ tabValue, handleTabChange }}>
            <Layout variant="l1">
              <>
                <Background />
                <section ref={homeRef} className={classes["section__home"]}>
                  <Home />
                </section>
                <section
                  ref={portfolioRef}
                  className={classes["section__projects"]}
                >
                  <CardList
                    type="projects"
                    description="Things I have built"
                    title="My Portfolio"
                    data={projects}
                    sectionMapping={sectionMapping.portfolio}
                  />
                </section>
                <section ref={aboutRef} className={classes["section__about"]}>
                  <About />
                </section>
                <section className={classes["section__quotes"]}>
                  <Quotes />
                </section>
                <section ref={skillRef} className={classes["section__skills"]}>
                  <Skills />
                </section>
                <section
                  ref={contactRef}
                  className={classes["section__contact"]}
                >
                  <Contact />
                </section>
              </>
            </Layout>
          </TabContext.Provider>
        ) : (
          <></>
        )}
      </div>
    </ParallaxProvider>
  );
};

export default withScrollToPosition(Main);
