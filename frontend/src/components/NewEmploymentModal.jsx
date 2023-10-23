import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
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
  LinearProgress,
  Tooltip,
} from "@mui/material";

import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const ProfileEditModal = ({ open, onClose, profilePrev }) => {
  const [profile, setProfile] = useState({
    username: profilePrev?.username || "",
    student_number: profilePrev?.student_number || "",
    first_name: profilePrev?.first_name || "",
    last_name: profilePrev?.last_name || "",
    email: profilePrev?.email || "",
    gender: profilePrev?.gender || "",
    birthdate: profilePrev?.birthdate ? dayjs(profilePrev.birthdate) : null,
    profile_picture: null,
    profile_picture_url:
      profilePrev?.profile_picture || "../default-profile-image.jpg",
    profile_picture_name: profilePrev?.username || "Upload profile picture",
    headline: profilePrev?.headline || "",
    city: profilePrev?.city || "",
    region: profilePrev?.region || "",
    address: profilePrev?.address || "",
    mobile_number: profilePrev?.mobile_number || "",
    civil_status: profilePrev?.civil_status || "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const axiosPrivate = useAxiosPrivate();
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

  const handleMobileNumberChange = (event) => {
    const value = event.target.value;

    // Check if the input is a number and does not start with 0
    if (/^\d*$/.test(value)) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        mobile_number: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        profile_picture: file,
      }));
      profile.profile_picture_url = URL.createObjectURL(
        profile.profile_picture
      );
      profile.profile_picture_name = profile.profile_picture.name;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const username =
      profile?.username == profilePrev?.username ? "" : profile?.username;
    const email = profile?.email == profilePrev?.email ? "" : profile?.email;
    const first_name =
      profile?.first_name == profilePrev?.first_name ? "" : profile?.first_name;
    const last_name =
      profile?.last_name == profilePrev?.last_name ? "" : profile?.last_name;
    const birthdate =
      profile?.birthdate == dayjs(profilePrev.birthdate)
        ? null
        : profile?.birthdate.format("YYYY-MM-DD");
    const gender =
      profile?.gender == profilePrev?.gender ? "" : profile?.gender;
    const headline =
      profile?.headline == profilePrev?.headline ? "" : profile?.headline;
    const city = profile?.city == profilePrev?.city ? "" : profile?.city;
    const region =
      profile?.region == profilePrev?.region ? "" : profile?.region;
    const address =
      profile?.address == profilePrev?.address ? "" : profile?.address;
    const mobile_number =
      profile?.mobile_number == profilePrev?.mobile_number
        ? ""
        : profile?.mobile_number;
    const civil_status =
      profile?.civil_status == profilePrev?.civil_status
        ? ""
        : profile?.civil_status;
    const student_number =
      profile?.student_number == profilePrev?.student_number
        ? ""
        : profile?.student_number;

    const payload = new FormData();
    payload.append("username", username);
    payload.append("email", email);
    payload.append("first_name", first_name);
    payload.append("last_name", last_name);
    payload.append("birthdate", birthdate);
    payload.append("gender", gender);
    payload.append("headline", headline);
    payload.append("city", city);
    payload.append("region", region);
    payload.append("address", address);
    payload.append("mobile_number", mobile_number);
    payload.append("civil_status", civil_status);
    payload.append("student_number", student_number);

    // For the file, it's a bit different
    if (profile?.profile_picture) {
      payload.append("profile_picture", profile.profile_picture);
    }

    try {
      setLoading(true);
      const axiosConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      // Make the PUT request to your FastAPI endpoint
      const response = await axiosPrivate.put(
        "/profiles/demographic_profiles/",
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
        if (profile.username !== profilePrev.username) {
          setAuth(); // clears out all the token logs you out in short
          navigate("/login", {
            state: {
              from: location,
              message:
                "please log in again but with your updated username this time.",
            },
            replace: true,
          });
        }
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
          <Tooltip title="click to update profile picture">
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

                  <Avatar
                    alt="Profile"
                    src={profile?.profile_picture_url}
                    sx={{ width: "100px", height: "100px" }}
                  />
                  <Typography variant="body2">
                    {profile.profile_picture_name}
                  </Typography>
                </Box>
              </CardActionArea>
            </Grid>
          </Tooltip>
          <Grid item xs={12}>
            {/* Username */}
            <TextField
              name="username"
              label="Username"
              value={profile.username}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
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
              <DemoContainer components={["DatePicker"]} sx={{ width: "100%" }}>
                <DemoItem>
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
              onChange={handleMobileNumberChange}
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
      {loading ? (
        <Box sx={{ width: "100%", position: "fixed", top: 0 }}>
          <LinearProgress />
        </Box>
      ) : null}
    </Dialog>
  );
};

export default ProfileEditModal;
