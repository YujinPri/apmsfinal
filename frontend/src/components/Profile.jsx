import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

const User = () => {
  const [user, setuser] = useState();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const location = useLocation();
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUser = async () => {
      try {
        const response = await axiosPrivate.get("/users/user/me", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setuser(response.data);
      } catch (err) {
        console.error(err);
        if (err.response.data.detail == "Token has expired") setAuth({}); //clears out all the token logs you out in short
        navigate("/login", {
          state: {
            from: location,
            message:
              "you have been logout automatically for security purposes, please login again",
          },
          replace: true,
        });
      }
    };

    getUser();

    return () => {
      isMounted = false;
      // controller.abort();
    };
  }, []);

  return (
    <article>
      <h2>user List</h2>
      {user ? (
        <ul>
          <li>{user?.username}</li>
        </ul>
      ) : (
        <p>No user to display</p>
      )}
    </article>
  );
};

export default User;
