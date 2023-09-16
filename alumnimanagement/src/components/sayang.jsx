import * as React from "react";
import {
  Button,
  Box,
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import SettingsIcon from "@mui/icons-material/Settings";
import { ReactComponent as HomeIcon } from "../icons/home.svg";
import { ReactComponent as NotificationIcon } from "../icons/notification.svg";
import { ReactComponent as PeopleIcon } from "../icons/people.svg";
import { ReactComponent as MegaphoneIcon } from "../icons/megaphone.svg";
import { ReactComponent as NewsIcon } from "../icons/news.svg";
import { ReactComponent as EventIcon } from "../icons/event.svg";
import { ReactComponent as CapitalIcon } from "../icons/capital.svg";
import AccountMenu from "../ui/AccountMenu";
import { useAuth } from "../context/UserContext";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
// import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";

const drawerWidth = 350;

const iconMap = {
  home: HomeIcon,
  notification: NotificationIcon,
  about: PeopleIcon,
  announcement: MegaphoneIcon,
  news: NewsIcon,
  events: EventIcon,
  fundraising: CapitalIcon,
};

export default function ClippedDrawer() {
  const { logout } = useAuth();

  return (
    <Box sx={{ display: "flex" }} flex={1}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h1">PUPQC APMS</Typography>
          <AccountMenu logout={logout} />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <Paper
            elevation={1}
            style={{
              padding: "20px",
              margin: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar>
              <PersonIcon />
            </Avatar>
            <div style={{ marginLeft: "20px" }}>
              <Typography variant="h6">Rose Anne Loyola</Typography>
              <Typography variant="body2" color="textSecondary">
                "Officer"
              </Typography>
            </div>
          </Paper>

          <Button
            startIcon={<SettingsIcon />}
            variant="outlined"
            color="primary"
          >
            home
          </Button>
          <Button variant="outlined" startIcon={<NotificationIcon />}>
            notification
          </Button>
          <Button variant="outlined" startIcon={<PeopleIcon />}>
            about
          </Button>

          <Button variant="outlined" startIcon={<MegaphoneIcon />}>
            announcement
          </Button>
          <Button variant="outlined" startIcon={<NewsIcon />}>
            news
          </Button>
          <Button variant="outlined" startIcon={<EventIcon />}>
            events
          </Button>
          <Button variant="outlined" startIcon={<CapitalIcon />}>
            fundraising
          </Button>
          {/* <List
            style={{
              padding: "16px",
            }}
          >
            {[
              "home",
              "notification",
              "about",
              "announcement",
              "news",
              "events",
              "fundraising",
            ].map((text, index) => (
              <Paper
                elevation={1}
                style={{
                  padding: "4px",
                  margin: "4px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {React.createElement(iconMap[text], {
                        style: { width: "32px" },
                      })}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              </Paper>
            ))}
          </List> */}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor purus non enim praesent elementum facilisis leo vel. Risus at
          ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
          quisque non tellus. Convallis convallis tellus id interdum velit
          laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
          adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
          integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
          eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
          quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
          vivamus at augue. At augue eget arcu dictum varius duis at consectetur
          lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
          faucibus et molestie ac.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
          ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
          elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse
          sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat
          mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis
          risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas
          purus viverra accumsan in. In hendrerit gravida rutrum quisque non
          tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant
          morbi tristique senectus et. Adipiscing elit duis tristique
          sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
          eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
          posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1, // Takes up all available space
          minWidth: `${drawerWidth}px`, // Match the width of the drawer
          padding: "16px", // Add padding as needed
          minHeight: "100vh", // Ensure it stretches to the bottom of the viewport
        }}
      >
        <Box
          sx={{
            width: "75%",
          }}
        >
          <Toolbar />
          <Paper
            elevation={1}
            style={{
              padding: "20px",
              margin: "4px",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">personal engagement metrics</Typography>
          </Paper>
          <Paper
            elevation={1}
            style={{
              padding: "20px",
              margin: "4px",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">contributors</Typography>
            <Box></Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
