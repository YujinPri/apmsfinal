import { Typography, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Import Axios

const LinkedInRedirect = () => {
  const navigate = useNavigate();
  const { auth, setPersist, setAuth, persist } = useAuth();
  const params = new URLSearchParams(window.location.search);
  const [loading, setLoading] = useState(true);

  const code = params.get("code");
  const state = params.get("state");

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  useEffect(() => {
    async function fetchData() {
      if (!code || !state) {
        if (!auth) {
          navigate("/login");
        } else {
          navigate("/home");
        }
      } else {
        if (auth?.access_token) {
          // If access token is already available, set loading to false
          setLoading(false);
          navigate("/home");
        } else {
          const axiosConfig = {
            headers: {
              "Content-Type": "application/json", // Change content type to JSON
            },
            withCredentials: true, // Set this to true for cross-origin requests with credentials
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
            const responseData = response?.data;
            console.log(responseData);

            if (response.status !== 200) {
              console.log(response.status);
            }

            const access_token = responseData?.access_token;
            const role = responseData?.role;
            const username = "linkedin";

            setAuth(username, role, access_token);
            setLoading(false);
          } catch (error) {
            console.error(error);
            navigate("/login");
          }
        }
      }
    }
    fetchData(); // Call the async function immediately
  }, []);

  useEffect(() => {
    // Check if auth has been updated (access token is ready)
    if (!loading) {
      navigate("/home");
    }
  }, [loading]);
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor={(theme) => theme.palette.common.main}
    >
      <Typography variant="h1" color="primary">
        Signing in using LinkedIn
      </Typography>
      <Typography variant="subtitle1" color="primary">
        Please wait as the system is signing you in.
      </Typography>
      <CircularProgress color="primary" sx={{ marginTop: "10vh" }} />
    </Box>
  );
};

export default LinkedInRedirect;
