import React from "react";
import Sidebar from "../components/navigator/Sidebar";
import Navbar from "../components/navigator/Navbar";
import { Box, Stack } from "@mui/material";
function MainLayout({ children, mode, setMode, activeIndex }) {
  const sidebarWidth = 25; // Update as needed

  return (
    <Box>
      <Navbar />
      <Box sx={{ display: "flex" }}>
        <Box
          position="fixed"
          sx={{
            display: { sm: "none", md: "block" },
          }}
          width={sidebarWidth+"vw"}
        >
          <Sidebar mode={mode} setMode={setMode} />
        </Box>
        <Box
          sx={{
            marginLeft: sidebarWidth + "vw",
            width: { md: "70vw", sm: "100vw" },
          }}
        >
          <Box sx={{ width: { md: "70%", sm: "100%" } }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;
