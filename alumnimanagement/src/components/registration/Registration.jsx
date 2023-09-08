import React, { useContext, useState } from "react";
// import { UserContext } from "../context/UserContext";
// import ErrorMessage from "./ErrorMessage";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { UserContext } from "../../context/UserContext";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  // const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);

  const submitRegistration = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, hashed_password: password }),
    };

    const response = await fetch("/api/users", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      // setErrorMessage(data.detail);
    } else {
      setToken(data.access_token);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmationPassword && password.length > 5) {
      submitRegistration();
    } else {
      // setErrorMessage(
      //   "Ensure that the passwords match and greater than 5 characters"
      // );
    }
  };

  return (
    <div className="column">
      <form className="box" onSubmit={handleSubmit}>
        <Card style={{ maxWidth: 600, margin: "0 auto", padding: "20px 5px", marginTop:"10vh"}}>
          <CardContent>
            <Typography gutterBottom variant="h5">
              alumni registration
            </Typography>
            <Typography gutterBottom color="textSecondary" variant="body2" component='p'>
              fill up the form and our team will get back to you within 24 hours
            </Typography>
            <Grid container spacing={1.5}>
              <Grid xs={3} item>
                <TextField
                  label="username"
                  placeholder="input username"
                  variant="outlined"
                  fullWidth
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
                  <VisuallyHiddenInput type="file" />
                </Button>
              </Grid>
              <Grid xs={12} sm={6} item>
                <TextField
                  label="first name"
                  placeholder="input first name"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid xs={12} sm={6} item>
                <TextField
                  label="last name"
                  placeholder="input last name"
                  variant="outlined"
                  fullWidth
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
                style={{
                  textTransform: "uppercase",
                  fontVariant: "small-caps",
                }}
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
