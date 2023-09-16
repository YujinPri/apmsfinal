import React from "react";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Navbar from "../components/Navbar";
import Rightbar from "../components/Rightbar";
import { Box, Stack } from "@mui/material";
function MainLayout({ children }) {
  return (
    <Box>
      <Navbar />
      <Stack direction="row">
        <Sidebar />
        <Feed />
        <Rightbar />
      </Stack>

      <Box>{children}</Box>
    </Box>
  );
}
export default MainLayout;
