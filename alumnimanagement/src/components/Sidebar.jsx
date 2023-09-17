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
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

function Sidebar({ mode, setMode, activeIndex }) {
  const [selectedIndex, setSelectedIndex] = React.useState(activeIndex);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Box
      flex={2}
      p={2}
      sx={{
        overflow: "auto",
        height: "100vh",
        display: { xs: "none", sm: "flex" },
        boxShadow: 1,
        justifyContent: "center",
        backgroundColor: (theme) => theme.palette.common.main,
      }}
    >
      <Box position="fixed" sx={{ maxWidth: "30%", boxSizing: "border-box" }}>
        <Card
          variant="outlined"
          sx={{
            backgroundColor: (theme) => theme.palette.secondary.main,
            marginY: 1,
            borderRadius: 2,
            paddingX: 2,
            paddingY: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Stars fontSize="small" />
            <Stars fontSize="small" />
            <Stars fontSize="small" />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar />
            <Box>
              <Typography variant="h6" fontWeight={800}>
                rose anne loyola
              </Typography>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                style={{ lineHeight: 1 }}
              >
                software designer at microsoft
              </Typography>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                style={{ lineHeight: 1 }}
              >
                batch 1992-1993
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "end" }}
          >
            alumni officer
          </Typography>
        </Card>
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
