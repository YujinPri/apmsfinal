import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  Avatar,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  Alert,
  CardActionArea,
  Snackbar,
} from "@mui/material";

import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import axios from "../api/axios";
import { Label } from "@mui/icons-material";

const ProfileEditModal = ({ open, onClose }) => {
  const [profile, setProfile] = useState({
    student_number: "",
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    birthdate: null,
    profile_picture: null,
    headline: "",
    city: "",
    region: "",
    address: "",
    mobile_number: "",
    civil_status: "",
  });

  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      birthdate: date,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        profile_picture: file,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const axiosConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const payload = new FormData();
    payload.append("student_number", profile.student_number);
    payload.append("first_name", profile.first_name);
    payload.append("last_name", profile.last_name);
    payload.append("email", profile.email);
    payload.append("gender", profile.gender);
    payload.append("birthdate", profile.birthdate);
    payload.append("headline", profile.headline);
    payload.append("city", profile.city);
    payload.append("region", profile.region);
    payload.append("address", profile.address);
    payload.append("mobile_number", profile.mobile_number);
    payload.append("civil_status", profile.civil_status);
    payload.append("profile_picture", profile.profile_picture);

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/profile/edit",
        payload,
        axiosConfig
      );

      const data = response?.data;

      if (response.status !== 200) {
        setMessage(data.detail);
        setSeverity("error");
      } else {
        setMessage("Profile updated successfully");
        setSeverity("success");
        onClose();
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail);
        setSeverity("error");
      } else if (error.request) {
        setMessage("No response received from the server");
        setSeverity("error");
      } else {
        setMessage("Error: " + error.message);
        setSeverity("error");
      }
    }

    setOpenSnackbar(true);
    setLoading(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* Profile Picture */}
            <CardActionArea component="label" htmlFor="profile-picture">
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
                  name="profile_picture"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {profile.profile_picture ? (
                  <>
                    <Avatar
                      alt="Profile"
                      src={URL.createObjectURL(profile.profile_picture)}
                      sx={{ width: "100px", height: "100px" }}
                    />
                    <Typography variant="body2">
                      {profile.profile_picture.name}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Avatar
                      alt="Profile"
                      src="../default-profile-image.jpg"
                      sx={{ width: "100px", height: "100px" }}
                    />
                    <Typography variant="body2">
                      Upload profile picture
                    </Typography>
                  </>
                )}
              </Box>
            </CardActionArea>
          </Grid>
          <Grid item xs={6}>
            {/* First Name */}
            <TextField
              name="first_name"
              label="First Name"
              value={profile.first_name}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            {/* Last Name */}
            <TextField
              name="last_name"
              label="Last Name"
              value={profile.last_name}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DemoItem
                // label={<Label componentName="DatePicker" valueType="date" />}
                >
                  <DatePicker
                    name="birthdate"
                    label="Birthdate"
                    value={profile.birthdate}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            {/* Email */}
            <TextField
              name="email"
              label="Email"
              value={profile.email}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            {/* Region */}
            <TextField
              name="region"
              label="Region"
              value={profile.region}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            {/* City */}
            <TextField
              name="city"
              label="City"
              value={profile.city}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            {/* Address */}
            <TextField
              name="address"
              label="Address"
              value={profile.address}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl sx={{ width: "100%" }}>
              {/* Civil Status */}
              <InputLabel>Civil Status</InputLabel>
              <Select
                name="civil_status"
                value={profile.civil_status}
                onChange={handleChange}
              >
                <MenuItem value="single">Single</MenuItem>
                <MenuItem value="married">Married</MenuItem>
                <MenuItem value="divorced">Divorced</MenuItem>
                <MenuItem value="widowed">Widowed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl sx={{ width: "100%" }}>
              {/* Gender */}
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            {/* Mobile Number */}
            <TextField
              name="mobile_number"
              label="Mobile Number"
              value={profile.mobile_number}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Save
        </Button>
      </DialogActions>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ProfileEditModal;
