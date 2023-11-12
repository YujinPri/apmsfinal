import { useMutation, useQueryClient, useQuery } from "react-query";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
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
  Skeleton,
  Autocomplete,
} from "@mui/material";

import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const ProfileEditModal = ({ open, onClose }) => {
  const logout = useLogout();
  const queryClient = useQueryClient();
  const localForceLogoutRef = useRef(false);

  const cities = queryClient.getQueryData("cities");
  const isLoadingCities = queryClient.isFetching("cities");

  const getData = async () => {
    return await axiosPrivate.get("/profiles/demographic_profile/me");
  };

  const { data: cachedData, isLoading: isLoadingDisplay } = useQuery(
    "demographic-profile",
    getData
  );

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (cachedData) {
      setProfile((prevProfile) => ({
        ...cachedData.data,
        birthdate: cachedData?.data.birthdate
          ? dayjs(cachedData?.data.birthdate)
          : null,
        profile_picture: prevProfile?.profile_picture || null,
        profile_picture_url: prevProfile?.profile_picture
          ? prevProfile.profile_picture_url
          : cachedData?.data.profile_picture || "default-profile-image.jpeg",
        profile_picture_name: prevProfile?.profile_picture
          ? prevProfile.profile_picture_name
          : cachedData?.data.username || "Upload profile picture",
      }));
    }
  }, [cachedData]);

  const signOut = async () => {
    logout();
    navigate("/login");
  };

  const mutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await axiosPrivate.put(
        "/profiles/demographic_profiles/",
        newProfile,
        axiosConfig
      );
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
        setOpenSnackbar(true);
      },
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("demographic-profile");
        queryClient.invalidateQueries("profile-me");

        setMessage("Profile updated successfully");
        setSeverity("success");

        if (localForceLogoutRef.current) {
          localForceLogoutRef.current = false;
          signOut();
          navigate("/login", {
            state: {
              from: location,
              message:
                "please log in again but with your updated username this time.",
            },
            replace: true,
          });
          onClose();
        }
      },
    }
  );
  const { isLoading, isError, error, isSuccess } = mutation;

  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);

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
        profile_picture_url: URL.createObjectURL(file),
        profile_picture_name: file.name,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

      const pattern = /^\d{4}-\d{5}-[A-Z]{2}-\d$/;
      if (!pattern.test(profile?.student_number)) {
        setMessage("invalid student input");
        setSeverity("error");
        setOpenSnackbar(true);
        return;
      }

    localForceLogoutRef.current =
      profile?.username !== cachedData?.data?.username;
    const username =
      profile?.username == cachedData?.data?.username ? "" : profile?.username;
    const email =
      profile?.email == cachedData?.data?.email ? "" : profile?.email;
    const first_name =
      profile?.first_name == cachedData?.data?.first_name
        ? ""
        : profile?.first_name;
    const last_name =
      profile?.last_name == cachedData?.data?.last_name
        ? ""
        : profile?.last_name;
    const birthdate =
      profile?.birthdate == dayjs(cachedData?.data.birthdate)
        ? null
        : profile?.birthdate.format("YYYY-MM-DD");
    const gender =
      profile?.gender == cachedData?.data?.gender ? "" : profile?.gender;
    const headline =
      profile?.headline == cachedData?.data?.headline ? "" : profile?.headline;
    const city = profile?.city == cachedData?.data?.city ? "" : profile?.city;
    const civil_status =
      profile?.civil_status == cachedData?.data?.civil_status
        ? ""
        : profile?.civil_status;
    const student_number =
      profile?.student_number == cachedData?.data?.student_number
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
    payload.append("civil_status", civil_status);
    payload.append("student_number", student_number);

    // For the file, it's a bit different
    if (profile?.profile_picture) {
      payload.append("profile_picture", profile.profile_picture);
    }

    try {
      await mutation.mutateAsync(payload);
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
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  if (isLoadingDisplay || isLoadingCities) {
    return (
      <Dialog open={true}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              {/* Profile Picture Skeleton */}
              <Skeleton variant="circular" width={100} height={100} />
              <Skeleton variant="text" width={210} height={20} />
            </Grid>
            <Grid item xs={12}>
              {/* Username Skeleton */}
              <Skeleton variant="text" width={210} height={30} />
            </Grid>
            <Grid item xs={6}>
              {/* First Name Skeleton */}
              <Skeleton variant="text" width={210} height={30} />
            </Grid>
            <Grid item xs={6}>
              {/* Last Name Skeleton */}
              <Skeleton variant="text" width={210} height={30} />
            </Grid>
            <Grid item xs={12}>
              {/* City Skeleton */}
              <Skeleton variant="text" width={210} height={30} />
            </Grid>
            <Grid item xs={12}>
              {/* Birthdate Skeleton */}
              <Skeleton variant="text" width={210} height={30} />
            </Grid>
            <Grid item xs={12}>
              {/* Email Skeleton */}
              <Skeleton variant="text" width={210} height={30} />
            </Grid>
            <Grid item xs={12}>
              {/* City Skeleton */}
              <Skeleton variant="text" width={210} height={50} />
            </Grid>
            <Grid item xs={6}>
              {/* Civil Status Skeleton */}
              <Skeleton variant="text" width={210} height={50} />
            </Grid>
            <Grid item xs={6}>
              {/* Gender Skeleton */}
              <Skeleton variant="text" width={210} height={50} />
            </Grid>
            <Grid item xs={12}>
              {/* Headline Skeleton */}
              <Skeleton variant="text" width={210} height={50} />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }

  const citiesOptions = cities;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        {!isLoadingDisplay && (
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
                      {profile?.profile_picture_name}
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
                value={profile?.username}
                onChange={handleChange}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={6}>
              {/* First Name */}
              <TextField
                name="first_name"
                label="First Name"
                value={profile?.first_name}
                onChange={handleChange}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={6}>
              {/* Last Name */}
              <TextField
                name="last_name"
                label="Last Name"
                value={profile?.last_name}
                onChange={handleChange}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                name="city"
                options={citiesOptions}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option, value) =>
                  option.name === value.name
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="city"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  />
                )}
                onChange={(event, value) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    city: value ? value.name : null,
                  }))
                }
                value={
                  citiesOptions.find(
                    (option) => option.name === profile?.city
                  ) || null
                }
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DatePicker"]}
                  sx={{ width: "100%" }}
                >
                  <DemoItem>
                    <DatePicker
                      name="birthdate"
                      label="Birthdate"
                      value={profile?.birthdate}
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
                value={profile?.email}
                onChange={handleChange}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12}>
              {/* Student Number */}
              <TextField
                name="student_number"
                label="Student Number"
                value={profile?.student_number}
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
                  value={profile?.civil_status || ""}
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
                  value={profile?.gender || ""}
                  onChange={handleChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="lgbtqia+">LGBTQIA+</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {/* Headline */}
              <TextField
                name="headline"
                label="Headline"
                value={profile?.headline}
                onChange={handleChange}
                multiline
                rows={2}
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading}
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
      {isLoading ? (
        <Box sx={{ width: "100%", position: "fixed", top: 0 }}>
          <LinearProgress />
        </Box>
      ) : null}
    </Dialog>
  );
};

export default ProfileEditModal;
