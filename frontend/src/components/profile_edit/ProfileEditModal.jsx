import { useMutation, useQueryClient, useQuery } from "react-query";
import { useState, useEffect, useRef, forwardRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import { IMaskInput } from "react-imask";
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
  Input,
  InputAdornment,
  FormControlLabel,
  Switch,
  OutlinedInput,
} from "@mui/material";

import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import useRegions from "../../hooks/useRegion";
import useCitiesMunicipalities from "../../hooks/useCitiesMunicipalities";
import useGetDemographicProfile from "../../hooks/useGetDemographicProfile";
import useBarangays from "../../hooks/useBarangays";
import useCountries from "../../hooks/useCountries";

const TelephoneMask = forwardRef(function TelephoneMask(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(#00) 000-0000"
      definitions={{
        "#": /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

const MobileNumberMask = forwardRef(function MobileNumberMask(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="+00 000-000-0000"
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

const StudentNumberMask = forwardRef(function StudentNumberMask(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="0000-00000-AA-0"
      definitions={{
        A: /[A-Z]/,
        0: /[0-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

const ProfileEditModal = ({ open, onClose }) => {
  const logout = useLogout();
  const queryClient = useQueryClient();
  const localForceLogoutRef = useRef(false);
  const [profile, setProfile] = useState(null);
  const [shrinkAddress, setShrinkAddress] = useState(profile?.adress);
  const [isEmailValid, setEmailValidity] = useState(true);

  const [shrinkOriginAddress, setShrinkOriginAddress] = useState(
    profile?.origin_address
  );

  const { data: cachedData, isLoading: isLoadingDisplay } =
    useGetDemographicProfile();

  const { data: countries, isLoading: isLoadingCountries } = useCountries();

  const { data: regions, isLoading: isLoadingRegions } = useRegions();

  const {
    data: citiesMunicipalities,
    isLoading: isLoadingCitiesMunicipalities,
  } = useCitiesMunicipalities(profile?.region_code);

  const { data: barangays, isLoading: isLoadingBarangays } = useBarangays(
    profile?.city_code
  );

  const { data: originCountries, isLoading: isLoadingOriginCountries } =
    useCountries();

  const { data: originRegions, isLoading: isLoadingOriginRegions } =
    useRegions();

  const {
    data: originCitiesMunicipalities,
    isLoading: isLoadingOriginCitiesMunicipalities,
  } = useCitiesMunicipalities(profile?.origin_region_code);

  const { data: originBarangays, isLoading: isLoadingOriginBarangays } =
    useBarangays(profile?.origin_city_code);

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
    console.log(cachedData);
  }, [cachedData]);

  const isValidEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

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
    if (name == "email") {
      setEmailValidity(isValidEmail(value));
      if (value == "") setEmailValidity(true);
    }
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

    localForceLogoutRef.current =
      profile?.username !== cachedData?.data?.username;

    let username =
      profile?.username == cachedData?.data?.username ? "" : profile?.username;
    let mobile_number =
      profile?.mobile_number == cachedData?.data?.mobile_number
        ? ""
        : profile?.mobile_number;
    let telephone_number =
      profile?.telephone_number == cachedData?.data?.telephone_number
        ? ""
        : profile?.telephone_number;
    let email = profile?.email == cachedData?.data?.email ? "" : profile?.email;

    let is_international =
      profile?.is_international == cachedData?.data?.is_international
        ? ""
        : profile?.is_international;
    let address =
      profile?.address == cachedData?.data?.address ? "" : profile?.address;
    let country =
      profile?.country == cachedData?.data?.country ? "" : profile?.country;
    let region =
      profile?.region == cachedData?.data?.region ? "" : profile?.region;
    let city = profile?.city == cachedData?.data?.city ? "" : profile?.city;
    let barangay =
      profile?.barangay == cachedData?.data?.barangay ? "" : profile?.barangay;
    let region_code =
      profile?.region_code == cachedData?.data?.region_code
        ? ""
        : profile?.region_code;
    let city_code =
      profile?.city_code == cachedData?.data?.city_code
        ? ""
        : profile?.city_code;
    let barangay_code =
      profile?.barangay_code == cachedData?.data?.barangay_code
        ? ""
        : profile?.barangay_code;

    let origin_is_international =
      profile?.origin_is_international ==
      cachedData?.data?.origin_is_international
        ? ""
        : profile?.origin_is_international;
    let origin_address =
      profile?.origin_address == cachedData?.data?.origin_address
        ? ""
        : profile?.origin_address;
    let origin_country =
      profile?.origin_country == cachedData?.data?.origin_country
        ? ""
        : profile?.origin_country;
    let origin_region =
      profile?.origin_region == cachedData?.data?.origin_region
        ? ""
        : profile?.origin_region;
    let origin_city =
      profile?.origin_city == cachedData?.data?.origin_city
        ? ""
        : profile?.origin_city;
    let origin_barangay =
      profile?.origin_barangay == cachedData?.data?.origin_barangay
        ? ""
        : profile?.origin_barangay;
    let origin_region_code =
      profile?.origin_region_code == cachedData?.data?.origin_region_code
        ? ""
        : profile?.origin_region_code;
    let origin_city_code =
      profile?.origin_city_code == cachedData?.data?.origin_city_code
        ? ""
        : profile?.origin_city_code;
    let origin_barangay_code =
      profile?.origin_barangay_code == cachedData?.data?.origin_barangay_code
        ? ""
        : profile?.origin_barangay_code;
    let first_name =
      profile?.first_name == cachedData?.data?.first_name
        ? ""
        : profile?.first_name;
    let last_name =
      profile?.last_name == cachedData?.data?.last_name
        ? ""
        : profile?.last_name;
    let birthdate =
      profile?.birthdate == dayjs(cachedData?.data.birthdate)
        ? null
        : profile?.birthdate.format("YYYY-MM-DD");
    let gender =
      profile?.gender == cachedData?.data?.gender ? "" : profile?.gender;
    let headline =
      profile?.headline == cachedData?.data?.headline ? "" : profile?.headline;
    let civil_status =
      profile?.civil_status == cachedData?.data?.civil_status
        ? ""
        : profile?.civil_status;
    let student_number =
      profile?.student_number == cachedData?.data?.student_number
        ? ""
        : profile?.student_number;

    if (is_international && country) {
      region = "";
      region_code = "";
      city = "";
      city_code = "";
      barangay = "";
      barangay_code = "";
      address = country;
    }

    if (origin_is_international && origin_country) {
      origin_region = "";
      origin_region_code = "";
      origin_city = "";
      origin_city_code = "";
      origin_barangay = "";
      origin_barangay_code = "";
      origin_address = origin_country;
    }

    const payload = new FormData();
    payload.append("username", username);
    payload.append("telephone_number", telephone_number);
    payload.append("mobile_number", mobile_number);
    payload.append("email", email);
    payload.append("is_international", is_international);
    payload.append("country", country);
    payload.append("address", address);
    payload.append("region", region);
    payload.append("city", city);
    payload.append("barangay", barangay);
    payload.append("region_code", region_code);
    payload.append("city_code", city_code);
    payload.append("barangay_code", barangay_code);
    payload.append("origin_is_international", origin_is_international);
    payload.append("origin_country", origin_country);
    payload.append("origin_address", origin_address);
    payload.append("origin_region", origin_region);
    payload.append("origin_city", origin_city);
    payload.append("origin_barangay", origin_barangay);
    payload.append("origin_region_code", origin_region_code);
    payload.append("origin_city_code", origin_city_code);
    payload.append("origin_barangay_code", origin_barangay_code);
    payload.append("first_name", first_name);
    payload.append("last_name", last_name);
    payload.append("birthdate", birthdate);
    payload.append("gender", gender);
    payload.append("headline", headline);
    payload.append("civil_status", civil_status);
    payload.append("student_number", student_number);

    if (profile?.profile_picture) {
      payload.append("profile_picture", profile?.profile_picture);
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

  if (isLoadingDisplay || isLoadingRegions || isLoadingOriginRegions) {
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

  return (
    <Dialog open={open} onClose={onClose}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <Box sx={{ width: "100%", position: "relative", top: 0 }}>
        {isLoading && <LinearProgress />}
        {!isLoading && <Box sx={{ height: 4 }} />}
      </Box>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography variant="h6" my={2}>
              Alumni Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  label="Username"
                  value={profile?.username}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="first_name"
                  label="First Name"
                  value={profile?.first_name}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="last_name"
                  label="Last Name"
                  value={profile?.last_name}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
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
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Student Number"
                  value={profile?.student_number}
                  onChange={handleChange}
                  name="student_number"
                  InputProps={{
                    inputComponent: StudentNumberMask,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Civil Status</InputLabel>
                  <Select
                    name="civil_status"
                    input={<OutlinedInput label="Civil Status" />}
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
                    input={<OutlinedInput label="Gender" />}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="lgbtqia+">LGBTQIA+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
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
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" my={2}>
              Contact Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={profile?.mobile_number}
                  onChange={handleChange}
                  name="mobile_number"
                  label="mobile number"
                  InputProps={{
                    inputComponent: MobileNumberMask,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={profile?.telephone_number}
                  onChange={handleChange}
                  name="telephone_number"
                  label="telephone number"
                  InputProps={{
                    inputComponent: TelephoneMask,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="email"
                  name="email"
                  label="Email"
                  value={profile?.email}
                  onChange={handleChange}
                  error={!isEmailValid}
                  helperText={!isEmailValid ? "Invalid email format" : ""}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" my={2}>
              Current Residence
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  sx={{ marginLeft: "auto" }}
                  control={
                    <Switch
                      origin_name="isorigin__international"
                      checked={profile?.is_international || false}
                      onChange={(event) => {
                        setProfile((prevProfile) => ({
                          ...prevProfile,
                          is_international: event.target.checked,
                        }));
                      }}
                    />
                  }
                  label="currently resides outside the Philippines"
                />
              </Grid>
            </Grid>
            {profile?.is_international ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    fullWidth
                    name="country"
                    options={countries}
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) =>
                      option.name === value.name
                    }
                    getOptionDisabled={(option) => option.name == "Philippines"}
                    renderInput={(params) => (
                      <TextField {...params} label="country" />
                    )}
                    onChange={(event, value) => {
                      setProfile((prevProfile) => ({
                        ...prevProfile,
                        country: value ? value.name : null,
                      }));
                    }}
                    value={
                      countries.find(
                        (option) => option.name === profile?.country
                      ) || null
                    }
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="address"
                    label="address"
                    value={profile?.address || ""}
                    InputLabelProps={{ shrink: shrinkAddress }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    fullWidth
                    name="region"
                    options={regions}
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) =>
                      option.name === value.name
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Region" />
                    )}
                    onChange={(event, value) => {
                      setProfile((prevProfile) => ({
                        ...prevProfile,
                        region: value ? value.name : null,
                        address: value ? value.name : null,
                        city: null,
                        barangay: null,
                        region_code: value ? value.code : null,
                        city_code: null,
                      }));
                      // Trigger the label animation
                      setShrinkAddress(true);
                      if (!value) setShrinkAddress(false);
                    }}
                    value={
                      regions.find(
                        (option) => option.name === profile?.region
                      ) || null
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    fullWidth
                    name="city"
                    disabled={
                      !citiesMunicipalities || isLoadingCitiesMunicipalities
                    }
                    options={citiesMunicipalities || []}
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) =>
                      option.name === value.name
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="city and municipality" />
                    )}
                    onChange={(event, value) => {
                      setProfile((prevProfile) => ({
                        ...prevProfile,
                        city: value ? value.name : null,
                        address: value
                          ? prevProfile?.region + ", " + value.name
                          : prevProfile?.region,
                        barangay: null,
                        city_code: value ? value.code : null,
                      }));
                    }}
                    value={
                      citiesMunicipalities?.find(
                        (option) => option.name === profile?.city
                      ) || null
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    fullWidth
                    name="barangay"
                    disabled={!barangays || isLoadingBarangays}
                    options={barangays || []}
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) =>
                      option.name === value.name
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="barangay" />
                    )}
                    onChange={(event, value) => {
                      setProfile((prevProfile) => ({
                        ...prevProfile,
                        barangay: value ? value.name : null,
                        address: value
                          ? prevProfile?.region +
                            ", " +
                            prevProfile?.city +
                            ", " +
                            value.name
                          : prevProfile?.region + ", " + prevProfile?.city,
                      }));
                    }}
                    value={
                      barangays?.find(
                        (option) => option.name === profile?.barangay
                      ) || null
                    }
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" my={2}>
              Place of Birth
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  sx={{ marginLeft: "auto" }}
                  control={
                    <Switch
                      defaultChecked
                      checked={profile?.origin_is_international || false}
                      onChange={(event) => {
                        setProfile((prevProfile) => ({
                          ...prevProfile,
                          origin_is_international: event.target.checked,
                        }));
                      }}
                      name="origin_is_international"
                    />
                  }
                  label="hometown is outside the Philippines"
                />
              </Grid>
              <Grid item xs={12}>
                {profile?.origin_is_international ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Autocomplete
                        fullWidth
                        name="country"
                        options={originCountries}
                        getOptionLabel={(option) => option.name}
                        getOptionSelected={(option, value) =>
                          option.name === value.name
                        }
                        getOptionDisabled={(option) =>
                          option.name == "Philippines"
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="country" />
                        )}
                        onChange={(event, value) => {
                          setProfile((prevProfile) => ({
                            ...prevProfile,
                            origin_country: value ? value.name : null,
                          }));
                        }}
                        value={
                          originCountries.find(
                            (option) => option.name === profile?.origin_country
                          ) || null
                        }
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="origin_address"
                        label="origin address"
                        value={profile?.origin_address || ""}
                        InputLabelProps={{ shrink: shrinkOriginAddress }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        fullWidth
                        name="origin_region"
                        options={originRegions}
                        getOptionLabel={(option) => option.name}
                        getOptionSelected={(option, value) =>
                          option.name === value.name
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="origin Region" />
                        )}
                        onChange={(event, value) => {
                          setProfile((prevProfile) => ({
                            ...prevProfile,
                            origin_region: value ? value.name : null,
                            origin_address: value ? value.name : null,
                            origin_city: null,
                            origin_barangay: null,
                            origin_region_code: value ? value.code : null,
                            origin_city_code: null,
                          }));
                          // Trigger the label animation
                          setShrinkOriginAddress(true);
                          if (!value) setShrinkOriginAddress(false);
                        }}
                        value={
                          originRegions.find(
                            (option) => option.name === profile?.origin_region
                          ) || null
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        fullWidth
                        name="origin city"
                        disabled={
                          !originCitiesMunicipalities ||
                          isLoadingOriginCitiesMunicipalities
                        }
                        options={originCitiesMunicipalities || []}
                        getOptionLabel={(option) => option.name}
                        getOptionSelected={(option, value) =>
                          option.name === value.name
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="city and municipality"
                          />
                        )}
                        onChange={(event, value) => {
                          setProfile((prevProfile) => ({
                            ...prevProfile,
                            origin_city: value ? value.name : null,
                            origin_address: value
                              ? prevProfile?.origin_region + ", " + value.name
                              : prevProfile?.origin_region,
                            origin_barangay: null,
                            origin_city_code: value ? value.code : null,
                          }));
                        }}
                        value={
                          originCitiesMunicipalities?.find(
                            (option) => option.name === profile?.origin_city
                          ) || null
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        fullWidth
                        name="originbarangay"
                        disabled={!originBarangays || isLoadingOriginBarangays}
                        options={originBarangays || []}
                        getOptionLabel={(option) => option.name}
                        getOptionSelected={(option, value) =>
                          option.name === value.name
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="origin barangay" />
                        )}
                        onChange={(event, value) => {
                          setProfile((prevProfile) => ({
                            ...prevProfile,
                            origin_barangay: value ? value.name : null,
                            origin_address: value
                              ? prevProfile?.origin_region +
                                ", " +
                                prevProfile?.origin_city +
                                ", " +
                                value.name
                              : prevProfile?.origin_region +
                                ", " +
                                prevProfile?.origin_city,
                          }));
                        }}
                        value={
                          originBarangays?.find(
                            (option) => option.name === profile?.origin_barangay
                          ) || null
                        }
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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
    </Dialog>
  );
};

export default ProfileEditModal;
