import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoutes from "./context/privateRoutes";
import { UserProvider } from "./context/UserContext";
import Login from "./components/Login";
import Register from "./components/Registration";
import Topbar from "./components/Topbar";


const theme = createTheme({
  palette: {
    primary: {
      main: "#282a3e", // Background color for the topbar
    },
    secondary: {
      main: "#e7e7e7", // Text color
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h1: {
      fontSize: "2rem", // Topbar title font size
      fontWeight: 900,
    },
    // Add more typography styles as needed
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <UserProvider>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoutes />}>
              <Route element={<MainLayout />}>
                <Route path="/home" element=<div>enloww</div> />
              </Route>
            </Route>
          </Routes>
        </UserProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
