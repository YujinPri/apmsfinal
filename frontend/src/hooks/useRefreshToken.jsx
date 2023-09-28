import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/auth/refresh", {
      headers: {
        Accept: "application/json",
      },
      withCredentials: true,
    });

    setAuth((prev) => {
      return {
        ...prev,
        access_token: response?.data?.access_token,
        role: response?.data?.role,
      };
    });
    return response?.data?.access_token;
  };

  return refresh;
};

export default useRefreshToken;
