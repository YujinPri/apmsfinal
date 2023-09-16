import {
  Box,
  Breadcrumbs,
  Button,
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

function Feed() {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  return (
    <Box flex={4} p={{ xs: 0, md: 2 }}>
      <Breadcrumbs separator="-" aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          <Typography variant="subtitle2" fontWeight="bold">
            home
          </Typography>
        </Link>
        <Link
          underline="hover"
          color="text.primary"
          href="/material-ui/react-breadcrumbs/"
          aria-current="page"
        >
          <Typography variant="subtitle2" fontWeight="bold">
            posts
          </Typography>
        </Link>
      </Breadcrumbs>

      <List sx={{ display: "flex", flexDirection: "row" }}>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <ListItem>
            <ListItemButton
              component="a"
              href="#home"
              selected={selectedIndex === 1}
              onClick={(event) => handleListItemClick(event, 1)}
            >
              <ListItemText primary="pupian" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              component="a"
              href="#notification"
              selected={selectedIndex === 2}
              onClick={(event) => handleListItemClick(event, 2)}
            >
              <ListItemText primary="alumni" />
            </ListItemButton>
          </ListItem>
        </Box>
        <Box sx={{ marginLeft: "auto" }}>
          <ListItem>
            <ListItemButton
              component="a"
              href="#allpost"
              selected={selectedIndex === 3}
              onClick={(event) => handleListItemClick(event, 3)}
            >
              <ListItemText primary={<Typography>all post</Typography>} />
            </ListItemButton>
          </ListItem>
        </Box>
      </List>

      <Box p={3}>
        <TextField
          id="outlined-multiline-flexible"
          label="write something"
          multiline
          rows={4}
          sx={{ width: "100%" }}
        />
        <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "start", justifyContent: "space-between" }}>
          <Typography variant="subtitle2" color="text.secondary">0/500</Typography>
          <Button
            variant="contained"
            sx={{ marginY: 1, textTransform: "none" }}
          >
            share
          </Button>
        </Box>
      </Box>
      <Box p={3} sx={{display: "flex", gap: 2, flexDirection: "column"}}>

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
