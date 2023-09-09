import React from "react";
import MainLayout from "../layout/MainLayout";
import Login from "../components/Login"
function LoginPage() {
  return (
    <MainLayout>
      <Login user="alumni" />
    </MainLayout>
  );
}

export default LoginPage;
