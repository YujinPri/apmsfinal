import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import MainLayout from "./layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoutes from "./routes/privateRoutes";
import OnSessionRoutes from "./routes/onSessionRoutes";
import { UserProvider } from "./context/UserContext";
import Feed from "./components/Feed";
import Explore from "./components/Explore";
import Announcements from "./components/Announcements";
import News from "./components/News";
import Events from "./components/Events";
import Fundraise from "./components/Fundraise";

const App = () => {
  const [mode, setMode] = useState("light");
  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === "dark" ? "#0f1731" : "#282a3e", // Set #282a3e as the main color
        contrastText: "#fff", // Contrast text color for primary
      },
      secondary: {
        main: mode === "dark" ? "#333" : "#edf2f5", // Text color based on mode
      },
      common: {
        main: mode === "dark" ? "#121212" : "#fff",
      },
      text: {
        primary: mode === "dark" ? "#fff" : "#282a3e",
      },
    },
    typography: {
      fontFamily: "Nunito, Arial, sans-serif", // Font family
      h1: {
        fontSize: "2rem", // Topbar title font size
        fontWeight: 900, // Bold style
      },
      body1: {
        fontSize: "inherit", // Inherit the font size from the parent element
      },
    },
    components: {
      MuiIconButton: {
        styleOverrides: {
          root: {
            "& svg": {
              color: mode === "dark" ? "#fff" : "#282a3e", // Replace with your desired icon color
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            "& svg": {
              color: mode === "dark" ? "#fff" : "#282a3e", // Replace with your desired icon color
            },
          },
        },
      },
    },
  });
  return (
    <Router>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <Box bgcolor={"background.default"} color={"text.primary"}>
            <Routes>
              <Route element={<OnSessionRoutes />}>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="" element={<LoginPage />} />
              </Route>
              <Route element={<PrivateRoutes />}>
                <Route
                  path="/home"
                  element={
                    <MainLayout mode={mode} setMode={setMode} activeIndex={1}>
                      <Feed />
                    </MainLayout>
                  }
                />
                <Route
                  path="/explore"
                  element={
                    <MainLayout mode={mode} setMode={setMode} activeIndex={2}>
                      <Explore />
                    </MainLayout>
                  }
                />
                <Route
                  path="/announcements"
                  element={
                    <MainLayout mode={mode} setMode={setMode} activeIndex={3}>
                      <Announcements />
                    </MainLayout>
                  }
                />
                <Route
                  path="/news"
                  element={
                    <MainLayout mode={mode} setMode={setMode} activeIndex={4}>
                      <News />
                    </MainLayout>
                  }
                />
                <Route
                  path="/events"
                  element={
                    <MainLayout mode={mode} setMode={setMode} activeIndex={5}>
                      <Events />
                    </MainLayout>
                  }
                />
                <Route
                  path="/fundraise"
                  element={
                    <MainLayout mode={mode} setMode={setMode} activeIndex={6}>
                      <Fundraise />
                    </MainLayout>
                  }
                />
              </Route>
            </Routes>
          </Box>
        </ThemeProvider>
      </UserProvider>
    </Router>
  );
};
export default App;
