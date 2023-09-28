import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoutes = ({ isOfficer = false }) => {
  const { auth } = useAuth();
  const location = useLocation();
  const active_role = isOfficer ? "officer" : "alumni";
  return auth?.role == active_role ? (
    <Outlet />
  ) : auth?.access_token ? (
    <Navigate to="/missing" state={{ from: location }} replace />
  ) : (
    <Navigate
      to="/login"
      state={{
        from: location,
        message:
          "you have been logout automatically for security purposes, please login again",
      }}
      replace
    />
  );
};

export default PrivateRoutes;
