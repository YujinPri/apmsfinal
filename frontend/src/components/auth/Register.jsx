import { useMutation, useQueryClient, useQuery } from "react-query";
import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";

import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const validatePassword = (password) => {
  // Set Minimum length Requirement
  if (password.length < 8) {
    return false;
  }

  // Check for at least one digit
  if (!/[0-9]/.test(password)) {
    return false;
  }

  // Check for at least one special character
  const specialCharacters = "!@#$%^&*\\(\\)-_=+\\[\\]{}|;:'\",.<>?/";
  if (!new RegExp(`[${specialCharacters}]`).test(password)) {
    return false;
  }

  return true;
};

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profile_picture: "",
    profile_picture_name: "Upload profile picture",
    profile_picture_url: "/default-profile-image.jpeg",
    password: "",
    confirmation_password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setFormData((prevProfile) => ({
        ...prevProfile,
        profile_picture: file,
        profile_picture_url: URL.createObjectURL(file),
        profile_picture_name: file.name,
      }));
    }
  };

  const mutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await axios.post(
        "/auth/register/alumni",
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
        setMessage("successfully registered!");

        setSeverity("success");

        setFormData({
          username: "",
          email: "",
          profile_picture: "",
          last_name: "",
          first_name: "",
          password: "",
          confirmation_password: "",
        });

        navigate("/login", {
          state: {
            message:
              "successfully registered now please login your credentials",
          },
          replace: true,
        });
      },
    }
  );

  const { isLoading, isError, error, isSuccess } = mutation;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.confirmation_password != formData.password) {
      setMessage("password does not match");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!validatePassword(formData.password)) {
      setMessage("password does not meet the requirements");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const payload = new FormData();
    payload.append("username", formData.username);
    payload.append("first_name", formData.first_name);
    payload.append("last_name", formData.last_name);
    payload.append("email", formData.email);
    payload.append("password", formData.password);
    payload.append("profile_picture", formData.profile_picture);

    await mutation.mutateAsync(payload);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form className="box" onSubmit={handleSubmit}>
        <Card
          sx={{
            maxWidth: 600,
            padding: "20px 5px",
          }}
        >
          <CardContent>
            <Typography gutterBottom variant="h5">
              alumni registration
            </Typography>
            <Grid container spacing={1.5}>
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
                        src={formData?.profile_picture_url}
                        sx={{ width: "100px", height: "100px" }}
                      />
                      <Typography variant="body2">
                        {formData?.profile_picture_name}
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Grid>
              </Tooltip>
              <Grid xs={12} item>
                <TextField
                  name="username"
                  label="username"
                  placeholder="input username"
                  variant="outlined"
                  fullWidth
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* First Name */}
                <TextField
                  name="first_name"
                  label="first name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* Last Name */}
                <TextField
                  name="last_name"
                  label="last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  sx={{ width: "100%" }}
                />
              </Grid>

              <Grid xs={12} item>
                <TextField
                  name="email"
                  label="email"
                  type="email"
                  placeholder="input email"
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  name="password"
                  label="password"
                  placeholder="Input password"
                  variant="outlined"
                  fullWidth
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  name="confirmation_password"
                  label="confirm password"
                  placeholder="confirm password"
                  variant="outlined"
                  fullWidth
                  type="password"
                  value={formData.confirmation_password}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                fullWidth
              >
                register
              </Button>
            </Grid>
            <Link
              to={"/login"}
              style={{ display: "block", textAlign: "center", marginTop: 8 }}
            >
              login instead
            </Link>
          </CardContent>
        </Card>
      </form>
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
    </Box>
  );
};

export default Register;
