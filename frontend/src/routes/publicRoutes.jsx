import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PublicRoutes = () => {
  const { auth } = useAuth();
  return !auth?.access_token ? <Outlet /> : <Navigate to="/home" />;
};

export default PublicRoutes;
