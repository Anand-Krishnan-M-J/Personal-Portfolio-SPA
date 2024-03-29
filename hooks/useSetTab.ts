import { useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { isMobile } from "react-device-detect";

import { TabContext } from "../pages";

import { useIsMobile } from "./useIsMobile";
//Logic to switch tabs use custom hook

export const useSetTab = (tabNumber: number) => {
  const { isMobileWidth } = useIsMobile();
  const { ref, inView } = useInView({
    threshold: 1,
  });
  const { tabValue, handleTabChange } = useContext(TabContext);
  useEffect(() => {
    if (inView === true) {
      handleTabChange(null as any, tabNumber);
    }
  }, [inView]);
  return {
    ref,
    inView: isMobile || isMobileWidth ? true : inView,
    tabValue,
    handleTabChange,
  };
};
