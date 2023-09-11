import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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

const Register = ({ user, setToken }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [profilepicture, setProfilePicture] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate(); // Get the navigate function
  const [loading, setLoading] = useState(false);

  const submitRegistration = async () => {
    try {
      setLoading(true);
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
    if (password === confirmationPassword) {
      submitRegistration();
    } else {
      setMessage("passwords doesn't match");
      setSeverity("error");
      setOpen(true);
    }
  };

  return (
    <div className="column">
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
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "20px 5px",
            marginTop: "10vh",
          }}
        >
          <CardContent>
            <Typography gutterBottom variant="h5">
              {user} registration
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
                  onChange={(e) => setProfilePicture(e.target.value)}
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
            <Link
              to={"/login"}
              style={{ display: "block", textAlign: "center", marginTop: 8 }}
            >
              login instead
            </Link>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default Register;
