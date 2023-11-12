import axios from "../api/axios";
import useAuth from "./useAuth";
import { useQueryClient } from "react-query"; // Import useQueryClient

const useLogout = () => {
  const { setAuth } = useAuth();
  const queryClient = useQueryClient(); // Get the queryClient instance

  const logout = async () => {
    setAuth({});
    try {
      await axios("/auth/logout", {
        withCredentials: true,
      });
      queryClient.clear();
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
