import React from "react";
import "./styles/topbar.css";
import { useAuth } from "../context/UserContext";
import AccountMenu from "../ui/AccountMenu";
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
const Topbar = () => {
  const { logout } = useAuth();
  return (
    <div>
      <div className="topbar" >
        <div className="topbarWrapper">
          <div className="topbarLeft">
            <div className="topbarTitle">PUPQC APMS</div>
          </div>
          <div className="topbarRight d-flex">
            <div className="topbarFunctions d-flex gap-2 pe-4 border-right">
              <Typography
                variant="h6"
                component="div"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography
                  variant="span"
                  component="span"
                  sx={{ marginRight: "10px" }}
                >
                  about
                </Typography>
                <Typography variant="span" component="span">
                  help
                </Typography>
              </Typography>
            </div>
            <div className="ps-4">
              <AccountMenu logout={logout} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
