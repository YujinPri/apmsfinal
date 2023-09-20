import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

function Fundraise() {
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
            fundraise
          </Typography>
        </Link>
      </Breadcrumbs>
    </Box>
  );
}

export default Fundraise;
