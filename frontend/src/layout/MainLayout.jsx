import React from "react";
import Sidebar from "../components/navigator/Sidebar";
import Navbar from "../components/navigator/Navbar";
import { Box, Stack } from "@mui/material";
function MainLayout({ children, mode, setMode, activeIndex }) {
  return (
    <Box>
      <Navbar />
      <Stack direction="row" minHeight={"100vh"}>
        <Sidebar mode={mode} setMode={setMode} activeIndex={activeIndex} />
        <Box sx={{ width: { md: "70vw", sm: "100vw" } }} marginX={"auto"}>
          <Box sx={{ width: { md: "70%", sm: "100%" } }}>{children}</Box>
        </Box>
      </Stack>
    </Box>
  );
}
export default MainLayout;
