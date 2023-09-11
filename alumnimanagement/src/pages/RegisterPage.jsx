import React from "react";
import Register from "../components/Register";
import { useAuth } from "../context/UserContext";

function RegisterPage() {
  const { setToken } = useAuth();
  return <Register user="alumni" setToken={setToken} />;
}

export default RegisterPage;
