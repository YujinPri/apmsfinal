import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("userToken"));
  const [user, setUser] = useState(localStorage.getItem("userData"));

  useEffect(() => {

    if(token == null) localStorage.setItem("userToken", null);
    if(user == null) localStorage.setItem("userData", null);

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
        } else {
          localStorage.setItem("userToken", token);
          setUser(JSON.stringify(response.data));
          localStorage.setItem("userData", user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setToken(null);
      }
    };
    fetchUser();
  }, [token, user]);

  const logout = async () => {
    setToken(null)
    setUser(null);
  };

  const contextData = {
    token,
    user,
    setToken,
    logout,
  };

  return (
    <UserContext.Provider value={contextData}>{children}</UserContext.Provider>
  );
};

export default UserContext;
