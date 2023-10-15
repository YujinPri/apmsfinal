import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import React, { useEffect } from "react";
import axios from "axios"; // Import Axios

const LinkedInRedirect = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const state = params.get("state");

  useEffect(() => {
    async function fetchData() {
      if (!code || !state) {
        if (!auth) {
          navigate("/login");
        } else {
          navigate("/home");
        }
      } else {
        const axiosConfig = {
          headers: {
            "Content-Type": "application/json", // Change content type to JSON
          },
        };

        const data = {
          authorization_code: code,
        };

        try {
          const response = await axios.post(
            "http://localhost:8000/api/v1/auth/linkedin-token",
            data,
            axiosConfig
          );
          const responseData = response.data;
          console.log(responseData);
          // Handle the data as needed
        } catch (error) {
          // Handle errors here
          console.error(error);
        }
      }
    }
    fetchData(); // Call the async function immediately
  }, []);

  return <Box>LinkedInRedirect</Box>;
};

export default LinkedInRedirect;
