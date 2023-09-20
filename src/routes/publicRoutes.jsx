import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PublicRoutes = () => {
  const { token } = useAuth();
  return !token ? <Outlet /> : <Navigate to="/home" />;
};

export default PublicRoutes;
