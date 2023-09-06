import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useState(sessionStorage.getItem("userToken"));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/users/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        if (response.status !== 200) {
          setToken(null);
        }

        localStorage.setItem("userToken", token);
      } catch (error) {
        // Handle any errors here
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={[token, setToken]}>
      {props.children}
    </UserContext.Provider>
  );
};