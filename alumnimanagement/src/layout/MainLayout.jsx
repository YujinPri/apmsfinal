import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Rightbar from "../components/Rightbar";
import { Box, Stack } from "@mui/material";
function MainLayout({ children, mode, setMode, activeIndex }) {
  return (
    <Box>
      <Navbar />
      <Stack direction="row">
        <Sidebar mode={mode} setMode={setMode} activeIndex={activeIndex} />
        <>{children}</>
        <Rightbar />
      </Stack>
    </Box>
  );
}
export default MainLayout;
