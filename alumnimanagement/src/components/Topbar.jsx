import React from "react";
import "./styles/topbar.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button } from "@mui/material";
import { useAuth } from "../context/UserContext";

const Topbar = () => {
  const { token, setToken, logout } = useAuth();
  return (
    <div>
      <div className="topbar">
        <div className="topbarWrapper">
          <div className="topbarLeft">
            <div className="topbarTitle">PUPQC APMS</div>
          </div>
          <div className="topbarRight d-flex">
            <div className="topbarFunctions d-flex gap-2 pe-4 border-right">
              {token && (
                <span>
                  <Button
                    className="button"
                    onClick={logout}
                    variant="contained" // You can use 'outlined' or 'text' for different styles
                  >
                    Logout
                  </Button>
                </span>
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
