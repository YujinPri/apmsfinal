import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import MainLayout from "./layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoutes from "./routes/privateRoutes";
import OnSessionRoutes from "./routes/onSessionRoutes";
import { UserProvider } from "./context/UserContext";

const App = () => {
  const [mode, setMode] = useState("light");
  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: "#282a3e", // Background color for the topbar
      },
      secondary: {
        main: "#e7e7e7", // Text color
      },
      common: {
        white: "#ffffff", // 60% white
        dark: "#282a3e", // 30% #282a3e
        light: "#e7e7e7", // 10% #e7e7e7
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
            </Route>
            <Route element={<PrivateRoutes />}>
              <Route path="/home" element={<MainLayout mode={mode} setMode={setMode}/>} />
            </Route>
          </Routes>
          </Box>
        </ThemeProvider>
      </UserProvider>
    </Router>
  );
};
export default App;
