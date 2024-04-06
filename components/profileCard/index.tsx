import { Box } from "@mui/material";
import Image from "next/image";

import classes from "./ProfileCard.module.scss";

export const ProfileCard = () => {
  return (
    <>
      <Box className={classes.profile__card}>
        <Box>
          <Image
            alt="Profile"
            width={220}
            height={220}
            src={"/images/profile.png"}
          />
        </Box>
      </Box>
    </>
  );
};
