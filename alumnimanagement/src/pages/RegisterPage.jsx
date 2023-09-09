import React from "react";
import MainLayout from "../layout/MainLayout";
import Register from "../components/Registration";

function RegisterPage() {
  return (
    <MainLayout>
      <Register user="alumni" />
    </MainLayout>
  );
}

export default RegisterPage;
