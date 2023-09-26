import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

const User = () => {
  const [user, setuser] = useState();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const location = useLocation();
  const { auth } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUser = async () => {
      try {
        const response = await axiosPrivate.get(
          "http://localhost:8000/api/v1/users/user/me",
          {
            headers: {
              Authorization: `Bearer ${auth?.access_token}`,
            },
            signal: controller.signal,
          }
        );
        console.log(response.data);
        isMounted && setuser(response.data);
      } catch (err) {
        if (err.name == "AbortError") console.log("Request was cancelled.");
        navigate("/login", { state: { from: location }, replace: true });
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
