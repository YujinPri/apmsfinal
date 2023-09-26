import { AppBar, Badge, Box, Toolbar, Typography, styled } from "@mui/material";
import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AccountMenu from "../ui/AccountMenu";
import { School, Notifications } from "@mui/icons-material/";
import AuthContext from "../context/AuthProvider";

const NavToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Icons = styled(Box)(({ theme }) => ({
  display: "none",
  alignItems: "center",
  gap: "10px",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));

const UserIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

const Navbar = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const logout = async () => {
    // if used in more components, this should be in context
    // axios to /logout endpoint
    setAuth({});
    navigate("/login");
  };
  return (
    <AppBar p={2} position="sticky">
      <NavToolbar>
        <School sx={{ display: { xs: "block", sm: "none" } }} />
        <Typography variant="h1" sx={{ display: { xs: "none", sm: "block" } }}>
          PUPQC APMS
        </Typography>
        <Icons>
          <Badge badgeContent={5} color="error">
            <Notifications />
          </Badge>
          <AccountMenu
            logout={logout}
            link="https://ucarecdn.com/c0549749-795b-4ae3-802c-3dfc275aa0b4/-/crop/1190x1000/5,0/-/resize/1035x870/"
          />
        </Icons>
        <UserIcon>
          <AccountMenu
            logout={logout}
            link="https://ucarecdn.com/c0549749-795b-4ae3-802c-3dfc275aa0b4/-/crop/1190x1000/5,0/-/resize/1035x870/"
          />
          <Typography variant="span">Laufey</Typography>
        </UserIcon>
      </NavToolbar>
    </AppBar>
  );
};

export default Navbar;
