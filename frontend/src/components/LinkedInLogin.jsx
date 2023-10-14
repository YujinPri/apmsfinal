import React from "react";

const LinkedInLogin = () => {
  const handleLinkedInAuth = () => {
    // Define your LinkedIn OAuth 2.0 parameters
    const clientId = `${import.meta.env.VITE_LINKEDIN_CLIENT_ID}`;
    const redirectUri = "http://localhost:5173/"; // Your callback URL
    const state = "random_state_value"; // You can generate a random value for the state

    // Define the scope as needed
    const scope = "openid profile w_member_social email";

    // Create the LinkedIn authorization URL
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

    // Redirect the user to LinkedIn for authorization
    window.location.href = authUrl;
  };

  return <button onClick={handleLinkedInAuth}>Sign in with LinkedIn</button>;
};

export default LinkedInLogin;
