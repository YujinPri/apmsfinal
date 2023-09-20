import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
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
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Register = () => {
  const { setToken } = useAuth();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate(); // Get the navigate function
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    profilepicture: "",
    temporaryprofilepicture: "#",
    password: "",
    confirmationPassword: "",
  });

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      // If a file is selected, update the formData and display its name
      setFormData({ ...formData, profilepicture: file });
    } else {
      // If no file is selected, set the value to "#"
      setFormData({ ...formData, profilepicture: "#" });
    }
  };

  const submitRegistration = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/user/", {
        username: formData.username,
        email: formData.email,
        first_name: formData.firstname,
        last_name: formData.lastname,
        // profile_picture: formData.profilepicture,
        profile_picture: formData.temporaryprofilepicture,
        plain_password: formData.password,
      });

      const data = response.data;

      if (response.status !== 200) {
        setMessage(data.detail);
        setSeverity("error");
      } else {
        setMessage("successfully logged in");
        setSeverity("success");
        setToken(data.access_token);
        navigate("/home");
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail);
        setSeverity("error");
      } else if (error.request) {
        setMessage("No response received from the server");
      } else {
        setMessage("Error:" + error.message);
        setSeverity("error");
      }
      setOpen(true);
    }
    setLoading(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password === formData.confirmationPassword) {
      submitRegistration();
    } else {
      setMessage("passwords doesn't match");
      setSeverity("error");
      setOpen(true);
    }
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
      {loading && (
        <Box sx={{ width: "100%", position: "fixed", top: 0 }}>
          <LinearProgress />
        </Box>
      )}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
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
            <Typography
              gutterBottom
              color="textSecondary"
              variant="body2"
              component="p"
            >
              fill up the form and our team will get back to you within 24 hours
            </Typography>
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
                          src={URL.createObjectURL(formData.profilepicture)}
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
                          src="/default-profile-image.jpg" // Add a default profile image source
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
    </Box>
  );
};

export default Register;
