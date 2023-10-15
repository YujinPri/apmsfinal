import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import MainLayout from "./layout/MainLayout";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoutes from "./routes/privateRoutes";
import PublicRoutes from "./routes/publicRoutes";
import AlumniOfficerRoutes from "./routes/alumniOfficerRoutes";
import Feed from "./components/Feed";
import Explore from "./components/Explore";
import Announcements from "./components/Announcements";
import News from "./components/News";
import Events from "./components/Events";
import Fundraise from "./components/Fundraise";
import Unauthorized from "./components/Unauthorized";
import Missing from "./components/Missing";
import Profile from "./components/Profile";
import PersistLogin from "./routes/persistLogin";
import UpdateProfile from "./components/UpdateProfile";
import LinkedInRedirect from "./components/LinkedInRedirect";

const App = () => {
  const [mode, setMode] = useState("light");
  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === "dark" ? "#555" : "#282a3e", // Set #282a3e as the main color
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
    <ThemeProvider theme={theme}>
      <Box bgcolor={"background.default"} color={"text.primary"}>
        <Routes>
          <Route path="/" element={<PublicRoutes />}>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="oauth/redirect/linkedin" element={<LinkedInRedirect />} />
            <Route path="" element={<Login />} />
          </Route>
          <Route element={<PersistLogin />}>
            <Route path="/" element={<PrivateRoutes />}>
              <Route
                path="unauthorized"
                element={
                  <MainLayout mode={mode} setMode={setMode} activeIndex={1}>
                    <Unauthorized />
                  </MainLayout>
                }
              />
              <Route
                path="home"
                element={
                  <MainLayout mode={mode} setMode={setMode} activeIndex={1}>
                    <Feed />
                  </MainLayout>
                }
              />
              <Route
                path="explore"
                element={
                  <MainLayout mode={mode} setMode={setMode} activeIndex={2}>
                    <Explore />
                  </MainLayout>
                }
              />
              <Route
                path="announcements"
                element={
                  <MainLayout mode={mode} setMode={setMode} activeIndex={3}>
                    <Announcements />
                  </MainLayout>
                }
              />
              <Route
                path="news"
                element={
                  <MainLayout mode={mode} setMode={setMode} activeIndex={4}>
                    <News />
                  </MainLayout>
                }
              />
              <Route
                path="events"
                element={
                  <MainLayout mode={mode} setMode={setMode} activeIndex={5}>
                    <Events />
                  </MainLayout>
                }
              />
              <Route
                path="profile/me"
                element={
                  <MainLayout mode={mode} setMode={setMode} activeIndex={7}>
                    <UpdateProfile />
                  </MainLayout>
                }
              />
              <Route element={<AlumniOfficerRoutes />}>
                <Route
                  path="fundraise"
                  element={
                    <MainLayout mode={mode} setMode={setMode} activeIndex={6}>
                      <Fundraise />
                    </MainLayout>
                  }
                />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Missing />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
};
export default App;
