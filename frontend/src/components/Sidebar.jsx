import {
  Campaign,
  Event,
  Explore,
  Home,
  ModeNight,
  MonetizationOn,
  Newspaper,
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
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

function Sidebar({ mode, setMode, activeIndex }) {
  const [selectedIndex, setSelectedIndex] = React.useState(activeIndex);
  const axiosPrivate = useAxiosPrivate();
  const [profile, setProfile] = useState();
  const [educ, setEduc] = useState();
  const { auth } = useAuth();

  const [employment, setEmployment] = useState();

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const initiateProfiles = async () => {
      try {
        const profile_response = await axiosPrivate.get(
          "/profiles/demographic_profile/me",
          {
            signal: controller.signal,
          }
        );

        const educ_response = await axiosPrivate.get(
          "/profiles/educational_profile/me",
          {
            signal: controller.signal,
          }
        );

        const employment_response = await axiosPrivate.get(
          "/profiles/employment_profiles/me?page=1&per_page=50",
          {
            signal: controller.signal,
          }
        );

        isMounted &&
          (setProfile(profile_response.data),
          setEduc(educ_response.data),
          setEmployment(employment_response.data));
      } catch (err) {
        console.error(err);
        if (err.profile_response.data.detail == "Token has expired")
          setAuth({}); //clears out all the token logs you out in short
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

    initiateProfiles();

    return () => {
      isMounted = false;
    };
  }, []);


  let headline = "";
  if (employment) {
    headline = employment.employments.reduce((prev, current) => {
      if (current.date_end === null) {
        if (prev === null) {
          return current;
        }
        if (new Date(current.date_hired) > new Date(prev.date_hired)) {
          return current;
        }
      }
      if (!prev) return employment.present_employment_status;
      return prev;
    }, null);
  }

  return (
    <Box
      flex={2}
      p={2}
      sx={{
        overflow: "auto",
        // height: "100vh",
        display: { xs: "none", sm: "flex" },
        boxShadow: 1,
        justifyContent: "center",
        backgroundColor: (theme) => theme.palette.common.main,
      }}
    >
      <Box position="fixed" sx={{ maxWidth: "30%", boxSizing: "border-box" }}>
        {!profile ? (
          <Card
            variant="outlined"
            sx={{
              backgroundColor: (theme) => theme.palette.secondary.main,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Skeleton variant="rectangular" width={40} height={20} />
                <Skeleton variant="rectangular" width={40} height={20} />
                <Skeleton variant="rectangular" width={40} height={20} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Skeleton variant="circular" width={60} height={60} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.2 }}>
                  <Skeleton variant="rectangular" width={120} height={24} />
                  <Skeleton variant="rectangular" width={100} height={16} />
                  <Skeleton variant="rectangular" width={80} height={16} />
                </Box>
              </Box>
              <Skeleton variant="rectangular" width={80} height={16} sx={{marginLeft: "auto", marginTop: 0.5}}/>
            </CardContent>
          </Card>
        ) : (
          <Card
            variant="outlined"
            sx={{
              backgroundColor: (theme) => theme.palette.secondary.main,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <CardActionArea component={RouterLink} to="/profile/me">
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Stars fontSize="small" />
                  <Stars fontSize="small" />
                  <Stars fontSize="small" />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    alt="Profile"
                    src={profile?.profile_picture}
                    sx={{ width: "60px", height: "60px" }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      sx={{ textTransform: "lowercase" }}
                    >
                      {profile?.first_name + " " + profile?.last_name}
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      gutterBottom
                      style={{ lineHeight: 1 }}
                    >
                      {headline}
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      gutterBottom
                      style={{ lineHeight: 1 }}
                    >
                      batch {educ?.year_graduated}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "end" }}
                >
                  {auth.role}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        )}

        <List sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
          <RouterLink
            to="/home"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem
              disablePadding
              sx={{
                backgroundColor: (theme) => theme.palette.secondary.main,
                borderRadius: 3,
              }}
            >
              <ListItemButton
                component="a"
                href="#home"
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
                sx={{ paddingY: 0.5 }}
              >
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={800}>
                      home
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
                backgroundColor: (theme) => theme.palette.secondary.main,
                borderRadius: 3,
              }}
            >
              <ListItemButton
                component="a"
                href="#explore"
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
                sx={{ paddingY: 0.5 }}
              >
                <ListItemIcon>
                  <Explore />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={800}>
                      explore
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </RouterLink>

          <Divider variant="middle" sx={{ marginY: 0.5 }} />

          <RouterLink
            to="/announcements"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem
              disablePadding
              sx={{
                backgroundColor: (theme) => theme.palette.secondary.main,
                borderRadius: 3,
              }}
            >
              <ListItemButton
                component="a"
                href="#announcements"
                selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 4)}
                sx={{ paddingY: 0.5 }}
              >
                <ListItemIcon>
                  <Campaign />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={800}>
                      announcements
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </RouterLink>
          <RouterLink
            to="/news"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem
              disablePadding
              sx={{
                backgroundColor: (theme) => theme.palette.secondary.main,
                borderRadius: 3,
              }}
            >
              <ListItemButton
                component="a"
                href="#news"
                selected={selectedIndex === 5}
                onClick={(event) => handleListItemClick(event, 5)}
                sx={{ paddingY: 0.5 }}
              >
                <ListItemIcon>
                  <Newspaper />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={800}>
                      news
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </RouterLink>
          <RouterLink
            to="/events"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem
              disablePadding
              sx={{
                backgroundColor: (theme) => theme.palette.secondary.main,
                borderRadius: 3,
              }}
            >
              <ListItemButton
                component="a"
                href="#events"
                selected={selectedIndex === 6}
                onClick={(event) => handleListItemClick(event, 6)}
                sx={{ paddingY: 0.5 }}
              >
                <ListItemIcon>
                  <Event />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={800}>
                      events
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </RouterLink>
          <RouterLink
            to="/fundraise"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem
              disablePadding
              sx={{
                backgroundColor: (theme) => theme.palette.secondary.main,
                borderRadius: 3,
              }}
            >
              <ListItemButton
                component="a"
                href="#fundraise"
                selected={selectedIndex === 7}
                onClick={(event) => handleListItemClick(event, 7)}
                sx={{ paddingY: 0.5 }}
              >
                <ListItemIcon>
                  <MonetizationOn />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={800}>
                      fundraise
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </RouterLink>
          <ListItem
            disablePadding
            sx={{
              backgroundColor: (theme) => theme.palette.secondary.main,
              borderRadius: 3,
            }}
          >
            <ListItemButton
              component="a"
              href="#simple-list"
              sx={{ paddingY: 0.5 }}
            >
              <ListItemIcon>
                <ModeNight />
              </ListItemIcon>
              <Switch
                onChange={(e) => setMode(mode === "light" ? "dark" : "light")}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}

export default Sidebar;
