import React from "react";
import Login from "../components/Login";
import { useAuth } from "../context/UserContext";

function LoginPage() {
  const { setToken } = useAuth();
  return <Login user="alumni" />;
}

export default LoginPage;
