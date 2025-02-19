import {
  AppBar,
  Badge,
  Box,
  Button,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import AccountMenu from "../ui/AccountMenu";
import { School, Notifications } from "@mui/icons-material/";

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
          <AccountMenu link="https://ucarecdn.com/c0549749-795b-4ae3-802c-3dfc275aa0b4/-/crop/1190x1000/5,0/-/resize/1035x870/" />
        </Icons>
        <UserIcon>
          <AccountMenu link="https://ucarecdn.com/c0549749-795b-4ae3-802c-3dfc275aa0b4/-/crop/1190x1000/5,0/-/resize/1035x870/" />
          <Typography variant="span"></Typography>
        </UserIcon>
      </NavToolbar>
    </AppBar>
  );
};

export default Navbar;
