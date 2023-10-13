import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

function RegisterProfile(formData, setFormData) {
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setFormData({ ...formData, profilepicture: file });
    }
    console.log(formData.profilepicture);
  };
  return (
    <>
      <Grid container spacing={1.5}>
        <Grid xs={12} item>
          <CardActionArea
            component="label" // Make the whole area act as a label for the input
            htmlFor="profile-picture"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 2,
              }}
            >
              <input
                type="file"
                accept="image/*"
                id="profile-picture"
                name="profilepicture"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              {formData.profilepicture ? (
                <>
                  <Avatar
                    alt="Profile"
                    src={URL?.createObjectURL(formData.profilepicture)}
                    sx={{ width: "100px", height: "100px" }}
                  />
                  <Typography variant="body2">
                    {formData.profilepicture.name}
                  </Typography>
                </>
              ) : (
                <>
                  <Avatar
                    alt="Profile"
                    src="../default-profile-image.jpg" // Add a default profile image source
                    sx={{ width: "100px", height: "100px" }}
                  />
                  <Typography variant="body2">
                    upload profile picture
                  </Typography>
                </>
              )}
            </Box>
          </CardActionArea>
        </Grid>
        <Grid xs={12} sm={6} item>
          <TextField
            name="username"
            label="username"
            placeholder="input username"
            variant="outlined"
            fullWidth
            value={formData.username}
            onChange={handleFieldChange}
            required
          />
        </Grid>
        <Grid xs={12} sm={6} item>
          <TextField
            name="email"
            label="email"
            type="email"
            placeholder="input email"
            variant="outlined"
            fullWidth
            onChange={handleFieldChange}
            value={formData.email}
            required
          />
        </Grid>
        <Grid xs={12} sm={6} item>
          <TextField
            name="firstname"
            label="first name"
            placeholder="input first name"
            variant="outlined"
            fullWidth
            value={formData.firstname}
            onChange={handleFieldChange}
            required
          />
        </Grid>
        <Grid xs={12} sm={6} item>
          <TextField
            name="lastname"
            label="last name"
            placeholder="input last name"
            variant="outlined"
            fullWidth
            value={formData.lastname}
            onChange={handleFieldChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="password"
            label="password"
            placeholder="Input password"
            variant="outlined"
            fullWidth
            type="password"
            value={formData.password}
            onChange={handleFieldChange}
            className="input"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="confirmationPassword"
            label="confirm password"
            placeholder="confirm password"
            variant="outlined"
            fullWidth
            type="password"
            value={formData.confirmationPassword}
            onChange={handleFieldChange}
            required
          />
        </Grid>
      </Grid>
    </>
  );
}

export default RegisterProfile;
