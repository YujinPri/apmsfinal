import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AlumniOfficerRoutes = ({ allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();
  const usrObj = JSON.parse(user);
  if (usrObj.is_officer) {
    return <Outlet />;
  } else {
    // If not an officer, navigate to the unauthorized route
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
};

export default AlumniOfficerRoutes;
