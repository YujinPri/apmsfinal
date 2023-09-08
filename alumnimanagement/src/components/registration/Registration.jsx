import React, { useContext, useState } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { UserContext } from "../../context/UserContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [profilepicture, setProfilePicture] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate(); // Get the navigate function

  const submitRegistration = async () => {
    try {
      const response = await axios.post("http://localhost:8000/user/", {
        username: username,
        email: email,
        first_name: firstname,
        last_name: lastname,
        profile_picture: profilepicture,
        plain_password: password,
      });

      const data = response.data;

      if (response.status !== 200) {
        setErrorMessage(data.detail);
      } else {
        setToken(data.access_token);
        navigate("/home");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.detail);
      } else if (error.request) {
        setErrorMessage("No response received from the server");
      } else {
        setErrorMessage("Error:" + error.message);
      }
      handleClick();
    }
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    handleClick(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmationPassword) {
      submitRegistration();
    } else {
      setErrorMessage("passwords doesn't match");
      handleClick();
    }
  };

  return (
    <div className="column">
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <form className="box" onSubmit={handleSubmit}>
        <Card
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "20px 5px",
            marginTop: "10vh",
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
              <Grid xs={3} item>
                <TextField
                  label="username"
                  placeholder="input username"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Grid>
              <Grid xs={6} item>
                <TextField
                  label="email"
                  type="email"
                  placeholder="input email"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="input"
                  required
                />
              </Grid>
              <Grid xs={3} item>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  href="#file-upload"
                >
                  upload
                  <VisuallyHiddenInput type="text" value={"#"} />
                </Button>
              </Grid>
              <Grid xs={12} sm={6} item>
                <TextField
                  label="first name"
                  placeholder="input first name"
                  variant="outlined"
                  fullWidth
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Grid>
              <Grid xs={12} sm={6} item>
                <TextField
                  label="last name"
                  placeholder="input last name"
                  variant="outlined"
                  fullWidth
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="password"
                  placeholder="Input password"
                  variant="outlined"
                  fullWidth
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="confirm password"
                  placeholder="confirm password"
                  variant="outlined"
                  fullWidth
                  type="password"
                  value={confirmationPassword}
                  onChange={(e) => setConfirmationPassword(e.target.value)}
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
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default Register;
