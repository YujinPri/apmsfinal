import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import Post from "../ui/Post";
import { Link as RouterLink } from "react-router-dom";
import User from "./Profile";

function Feed() {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  return (
    <Box
      flex={4}
      p={{ xs: 0, md: 2 }}
      sx={{
        backgroundColor: (theme) => theme.palette.secondary.main,
        display: "flex",
        gap: 2,
        flexDirection: "column",
      }}
    >
      <User />
      <Breadcrumbs separator="-" aria-label="breadcrumb">
        <RouterLink
          to="/home"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography variant="subtitle1" fontWeight={800}>
            home
          </Typography>
        </RouterLink>
        <Link
          underline="hover"
          color="text.primary"
          href="#"
          aria-current="page"
        >
          <Typography variant="subtitle1" fontWeight={800}>
            feeds
          </Typography>
        </Link>
      </Breadcrumbs>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.common.main,
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="#home"
              selected={selectedIndex === 1}
              onClick={(event) => handleListItemClick(event, 1)}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    textAlign="center"
                  >
                    pupian
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
          <Divider orientation="vertical" variant="middle" flexItem />
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="#notification"
              selected={selectedIndex === 2}
              onClick={(event) => handleListItemClick(event, 2)}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    textAlign="center"
                  >
                    all
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>

      <Box
        p={3}
        sx={{
          backgroundColor: (theme) => theme.palette.common.main,
          borderRadius: 3,
        }}
      >
        <TextField
          id="outlined-multiline-flexible"
          label="write something"
          multiline
          rows={4}
          sx={{ width: "100%" }}
        />
        <Box
          sx={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            0/500
          </Typography>
          <Button
            variant="contained"
            sx={{ marginY: 1, textTransform: "none" }}
          >
            share
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </Box>
    </Box>
  );
}

export default Feed;
