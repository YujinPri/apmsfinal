import React from "react";
import Sidebar from "../components/navigator/Sidebar";
import Navbar from "../components/navigator/Navbar";
import { Box, Stack } from "@mui/material";
function MainLayout({ children, mode, setMode, activeIndex }) {
  return (
    <Box>
      <Navbar />
      <Stack direction="row">
        <Sidebar mode={mode} setMode={setMode} activeIndex={activeIndex} />
        <>{children}</>
      </Stack>
    </Box>
  );
}
export default MainLayout;
