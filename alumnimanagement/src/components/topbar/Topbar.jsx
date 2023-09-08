import React, { useContext, useState, useEffect } from "react";
import "./topbar.css";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button } from "@mui/material";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const [token, setToken] = useContext(UserContext);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };

  // Use the useState hook to manage the visibility of "register" and "login" links
  const [showAuthLinks, setShowAuthLinks] = useState(true);

  useEffect(() => {
    // Update the visibility of "register" and "login" links based on the token state
    setShowAuthLinks(!token);
  }, [token]);

  return (
    <div>
      <div className="topbar">
        <div className="topbarWrapper">
          <div className="topbarLeft">
            <div className="topbarTitle">PUPQC APMS</div>
            <div className="topbarTitle">PUPQC APMS</div>
          </div>
          <div className="topbarRight d-flex">
            <div className="topbarFunctions d-flex gap-2 pe-4 border-right">
              {token ? (
                // If token is true (logged in), render the "logout" button
                <span>
                  <Button className="button" onClick={handleLogout}>
                    logout
                  </Button>
                </span>
              ) : (
                // If token is false (not logged in), render the "register" and "login" links
                showAuthLinks && (
                  <>
                    <span>
                      <Link to="/register" className="text-decoration-none">
                        register
                      </Link>
                    </span>
                    <span>
                      <Link to="/login" className="text-decoration-none">
                        login
                      </Link>
                    </span>
                  </>
                )
              )}
            </div>
            <div className="ps-4">
              <AccountCircleIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
