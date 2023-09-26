import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoutes = () => {
  const {auth} = useAuth();
  return auth?.access_token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
