import { SentimentVeryDissatisfied } from "@mui/icons-material";
import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

function UserNotFound() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="90vh"
      bgcolor={(theme) => theme.palette.secondary.main}
    >
      <SentimentVeryDissatisfied style={{ fontSize: 150 }} />
      <Typography variant="h1" color="primary" style={{ fontSize: "4rem" }}>
        404
      </Typography>

      <Typography variant="h6" color="primary">
        Not Found
      </Typography>
      <Typography variant="subtitle2" p={"1rem"}>
        Sorry, the requested URL does not exist
      </Typography>
    </Box>
  );
}

export default UserNotFound;
