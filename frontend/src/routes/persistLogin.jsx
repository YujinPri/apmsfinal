import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import LoadingCircular from "../components/status_display/LoadingCircular";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };
    !auth?.access_token ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  return (  
    <>
    {!persist ? <Outlet/> : isLoading ? <LoadingCircular baseHeight={"100vh"}/> : <Outlet />}</>
  );
};

export default PersistLogin;
