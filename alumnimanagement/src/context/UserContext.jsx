import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("userToken"));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        if (response.status !== 200) {
          setToken(null);
          localStorage.removeItem("userToken"); // Remove invalid token from localStorage
        }

        localStorage.setItem("userToken", token);
      } catch (error) {
        console.error("Error fetching user:", error);
        setToken(null);
        localStorage.removeItem("userToken"); // Remove invalid token from localStorage
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
