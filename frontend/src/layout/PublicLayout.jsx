import React from "react";
import Navbar from "../components/navigator/Navbar";
import { Box, Typography, styled } from "@mui/material";
import UpdateProfile from "../components/profile_edit/UpdateProfile";

const Adaptive = styled(Box)(({ theme }) => ({
  padding: "0 5%",
  [theme.breakpoints.up("md")]: {
    padding: "0 25%",
  },
}));

function PublicLayout({ children }) {
  return (
    <Box>
      <Navbar />
      <Adaptive>
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.secondary.main,
            marginY: "3vh",
            paddingY: "3vh",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              width: "80%",
              marginX: "auto",
            }}
            variant="subtitle2"
          >
            You are currently a public user, your profile is currently awaiting
            approval from the PUPQC faculty. To increase your chances of swift
            approval, we recommend updating your profile in the meantime.
          </Typography>
        </Box>
        {children}
      </Adaptive>
    </Box>
  );
}
export default PublicLayout;
