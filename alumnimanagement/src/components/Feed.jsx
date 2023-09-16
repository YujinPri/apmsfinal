import { Box } from "@mui/material";
import React from "react";
import Post from "../ui/Post"

function Feed() {
  return (
    <Box flex={4} p={{ xs: 0, md: 2 }}>
      <Post/>
    </Box>
  );
}

export default Feed;
