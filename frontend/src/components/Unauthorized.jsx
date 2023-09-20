import { Button } from "@mui/material";
import React from "react";
import useAuth from "../hooks/useAuth";

function Unauthorized() {
  const { logout, user } = useAuth();
  return (
    <div>
      <Button onClick={logout}>logout</Button>
    </div>
  );
}

export default Unauthorized;
