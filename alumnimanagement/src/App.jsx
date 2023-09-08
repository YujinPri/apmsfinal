import React, { useState, useEffect } from "react";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material";
import MainLayout from "./layout/MainLayout";

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
  // const [message, setMessage] = useState("");
  // const [token] = useContext(UserContext);

  // useEffect(() => {
  //   async function getData() {
  //     try {
  //       const response = await axios.get("http://localhost:8000/");
  //       setMessage(response.data.message);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }

  //   getData();
  // }, []); 

  return (
    <ThemeProvider theme={theme}>
      <MainLayout>
        {/* <Topbar /> */}
      </MainLayout>
    </ThemeProvider>
  );
};

export default App;
