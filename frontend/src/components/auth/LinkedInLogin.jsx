import { Button } from "@mui/material";
import React from "react";

const LinkedInLogin = () => {
  const handleLinkedInAuth = () => {
    // Define your LinkedIn OAuth 2.0 parameters
    const randomString = [...Array(30)]
      .map(() => Math.random().toString(36)[2])
      .join("");

    const clientId = `${import.meta.env.VITE_LINKEDIN_CLIENT_ID}`;
    const redirectUri = `${import.meta.env.VITE_LINKEDIN_REDIRECT}`; // Your callback URL
    const state = randomString; // You can generate a random value for the state

    // Define the scope as needed
    const scope = "openid profile w_member_social email";

    // Create the LinkedIn authorization URL
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

    // Redirect the user to LinkedIn for authorization
    window.location.href = authUrl;
  };

  return (
    <Button
      onClick={handleLinkedInAuth}
      sx={{
        backgroundColor: "transparent",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <img
        src="linkedIn.png"
        alt="Sign in with LinkedIn"
        style={{
          padding: 1,
          transition: "filter 0.3s ease",
          filter: "brightness(1)",
          "&:hover": {
            filter: "brightness(0.5)",
          },
        }}
      />
    </Button>
  );
};

export default LinkedInLogin;
