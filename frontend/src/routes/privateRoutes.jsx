import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoutes = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const roles = ["public", "officer", "alumni", "admin"];
  return roles.includes(auth?.role) ? (
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
