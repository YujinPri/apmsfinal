import {
  AccountCircle,
  Campaign,
  CheckBoxOutlineBlank,
  CheckBoxOutlineBlankRounded,
  Event,
  Explore,
  Home,
  HowToReg,
  Hub,
  LightMode,
  ModeNight,
  MonetizationOn,
  Newspaper,
  People,
  Settings,
  Stars,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Skeleton,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Profile from "./ProfileCard";

function Sidebar({ mode, setMode }) {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const { auth, setAuth } = useAuth();

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Box p={1} paddingRight={5}>
      <Profile />
      <List sx={{ display: "flex", gap: 0.5, flexDirection: "column" }}>
        <RouterLink
          to="/home"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem
            disablePadding
            sx={{
              borderRadius: 3,
            }}
          >
            <ListItemButton
              component="a"
              href="#home"
              selected={selectedIndex === 1}
              onClick={(event) => handleListItemClick(event, 1)}
            >
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight={800}>
                    Home
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </RouterLink>
        <RouterLink
          to="/explore"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem
            disablePadding
            sx={{
              borderRadius: 3,
            }}
          >
            <ListItemButton
              component="a"
              href="#explore"
              selected={selectedIndex === 3}
              onClick={(event) => handleListItemClick(event, 3)}
            >
              <ListItemIcon>
                <Explore />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight={800}>
                    Explore
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </RouterLink>
        <RouterLink
          to="/alumni-nexus"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem
            disablePadding
            sx={{
              borderRadius: 3,
            }}
          >
            <ListItemButton
              component="a"
              href="#alumninexus"
              selected={selectedIndex === 4}
              onClick={(event) => handleListItemClick(event, 4)}
            >
              <ListItemIcon>
                <Hub />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight={800}>
                    Alumni Nexus
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </RouterLink>
        <Divider variant="middle" sx={{ marginY: 0.5 }} />

        {auth?.role == "admin" ? (
          <>
            <RouterLink
              to="/selections"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                disablePadding
                sx={{
                  borderRadius: 3,
                }}
              >
                <ListItemButton
                  selected={selectedIndex === 8}
                  onClick={(event) => handleListItemClick(event, 8)}
                >
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight={800}>
                        Options Management
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </RouterLink>
            <RouterLink
              to="/accounts"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                disablePadding
                sx={{
                  borderRadius: 3,
                }}
              >
                <ListItemButton
                  selected={selectedIndex === 9}
                  onClick={(event) => handleListItemClick(event, 9)}
                >
                  <ListItemIcon>
                    <People />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight={800}>
                        Alumni Accounts
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </RouterLink>
            <RouterLink
              to="/approve-accounts"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                disablePadding
                sx={{
                  borderRadius: 3,
                }}
              >
                <ListItemButton
                  selected={selectedIndex === 10}
                  onClick={(event) => handleListItemClick(event, 10)}
                >
                  <ListItemIcon>
                    <HowToReg />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight={800}>
                        Accounts Approval
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </RouterLink>
          </>
        ) : null}

        <ListItem
          disablePadding
          sx={{
            borderRadius: 3,
          }}
        >
          <ListItemButton
            component="a"
            href="#simple-list"
            sx={{ paddingY: 0.5 }}
          >
            <ListItemIcon>
              {!(mode === "light") ? <ModeNight /> : <LightMode />}
            </ListItemIcon>
            <Switch
              onChange={(e) => setMode(mode === "light" ? "dark" : "light")}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}

export default Sidebar;
