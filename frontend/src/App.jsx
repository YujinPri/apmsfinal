import React, { useState } from "react";
import { useContext } from "react";
import AuthContext from "./context/AuthProvider";
import { Routes, Route } from "react-router-dom";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoutes from "./routes/privateRoutes";
import PublicRoutes from "./routes/publicRoutes";
import Feed from "./components/Feed";
import Explore from "./components/Explore";
import Announcements from "./components/Announcements";
import News from "./components/News";
import Events from "./components/Events";
import Fundraise from "./components/Fundraise";
import { QueryClientProvider, QueryClient } from "react-query";
import Missing from "./components/status_display/UserNotFound";
import PersistLogin from "./routes/persistLogin";
import LinkedInRedirect from "./components/auth/LinkedInRedirect";
import { ReactQueryDevtools } from "react-query/devtools";
import RoleBasedRoutes from "./routes/RoleBasedRoutes";
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
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Box bgcolor={"background.default"} color={"text.primary"}>
          <Routes>
            <Route path="/" element={<PublicRoutes />}>
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route
                path="oauth/redirect/linkedin"
                element={<LinkedInRedirect />}
              />
              <Route path="" element={<Login />} />
            </Route>
            <Route element={<PersistLogin />}>
              <Route path="/" element={<PrivateRoutes />}>
                <Route
                  path="*"
                  element={<RoleBasedRoutes mode={mode} setMode={setMode} />}
                />
              </Route>
            </Route>
            <Route path="*" element={<Missing />} />
          </Routes>
          <ReactQueryDevtools position="bottom-right" initialIsOpen={false} />
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
export default App;
