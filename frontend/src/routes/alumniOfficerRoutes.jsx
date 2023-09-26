import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AlumniOfficerRoutes = () => {
  const { auth } = useAuth();
  const location = useLocation();
  if (auth?.access_token && auth?.role == "officer") {
    return <Outlet />;
  } else {
    // If not an officer, navigate to the unauthorized route
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
};

export default AlumniOfficerRoutes;

