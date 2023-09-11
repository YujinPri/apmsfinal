import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";

const OnSessionRoutes = () => {
  const { token } = useAuth();
  return !token ? <Outlet /> : <Navigate to="/home" />;
};

export default OnSessionRoutes;
