import React from "react";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Navbar from "../components/Navbar";
import Rightbar from "../components/Rightbar";
import { Box, Stack } from "@mui/material";
function MainLayout({ children, mode, setMode }) {
  return (
    <Box>
      <Navbar />
      <Stack direction="row">
        <Sidebar mode={mode} setMode={setMode}/>
        <Feed />
        <Rightbar />
      </Stack>

      <Box>{children}</Box>
    </Box>
  );
}
export default MainLayout;
