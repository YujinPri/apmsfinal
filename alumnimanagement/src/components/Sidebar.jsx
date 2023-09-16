import {
  Campaign,
  Event,
  Home,
  ModeNight,
  MonetizationOn,
  Newspaper,
  Notifications,
  PeopleSharp,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";
import React from "react";

function Sidebar({ mode, setMode }) {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Box
      flex={2}
      p={1}
      sx={{ overflow: "auto", display: { xs: "none", sm: "block" } }}
    >
      <Box position="fixed" sx={{ maxWidth: "30%" }}>
        <Card variant="outlined">
          <CardContent
            sx={{ display: "flex", alignItems: "center", gap: 2, padding: 2 }}
          >
            <Avatar />
            <Box>
              <Typography variant="h6" fontWeight={800}>
                rose anne loyola
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "end" }}
              >
                officer
              </Typography>
            </Box>
          </CardContent>
        </Card>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="#home"
              selected={selectedIndex === 1}
              onClick={(event) => handleListItemClick(event, 1)}
            >
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="home" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="#notification"
              selected={selectedIndex === 2}
              onClick={(event) => handleListItemClick(event, 2)}
            >
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText primary="notification" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="#about"
              selected={selectedIndex === 3}
              onClick={(event) => handleListItemClick(event, 3)}
            >
              <ListItemIcon>
                <PeopleSharp />
              </ListItemIcon>
              <ListItemText primary="about" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="#announcements"
              selected={selectedIndex === 4}
              onClick={(event) => handleListItemClick(event, 4)}
            >
              <ListItemIcon>
                <Campaign />
              </ListItemIcon>
              <ListItemText primary="announcements" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="#news"
              selected={selectedIndex === 5}
              onClick={(event) => handleListItemClick(event, 5)}
            >
              <ListItemIcon>
                <Newspaper />
              </ListItemIcon>
              <ListItemText primary="news" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="#events"
              selected={selectedIndex === 6}
              onClick={(event) => handleListItemClick(event, 6)}
            >
              <ListItemIcon>
                <Event />
              </ListItemIcon>
              <ListItemText primary="events" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="#fundraise"
              selected={selectedIndex === 7}
              onClick={(event) => handleListItemClick(event, 7)}
            >
              <ListItemIcon>
                <MonetizationOn />
              </ListItemIcon>
              <ListItemText primary="fundraise" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#simple-list">
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
