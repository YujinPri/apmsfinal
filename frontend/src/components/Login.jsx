import React, { useState, useRef, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "../api/axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
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

const Login = () => {
  const { setAuth } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/home";

  const userRef = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = useState("error");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setMessage("");
  }, [username, password]);

  const submitLogin = async () => {
    const dataString =
      "grant_type=&username=" +
      username +
      "&password=" +
      password +
      "&scope=&client_id=&client_secret=";

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const axiosConfig = {
      headers,
      withCredentials: true, // Set this to true for cross-origin requests with credentials
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/auth/token",
        dataString,
        axiosConfig
      );
      const data = response?.data;
      console.log(JSON.stringify(data));

      if (response.status !== 200) {
        setMessage(data.detail);
        setSeverity("error");
      }

      const access_token = data?.access_token;
      const role = data?.role;
      setAuth({ username, role, access_token });

      setUsername("");
      setPassword("");

      navigate(from, { replace: true });
    } catch (error) {
      if (error.response) setMessage(error?.response?.data?.detail);
      else if (error.response?.status === 400)
        setMessage("Missing Username or Password");
      else if (error?.request)
        setMessage("No response received from the server");
      else setMessage("Error:" + error.message);

      setSeverity("error");
      setOpen(true);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
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
          style={{
            maxWidth: 600,
            padding: "20px 5px",
          }}
        >
          <CardContent>
            <Typography gutterBottom variant="h5">
              alumni login
            </Typography>
            <Typography
              gutterBottom
              color="textSecondary"
              variant="body2"
              component="p"
            >
              ready to relive memories? just loginn!
            </Typography>
            <Grid container spacing={1.5}>
              <Grid xs={12} item>
                <TextField
                  label="username"
                  inputRef={userRef} 
                  placeholder="input username"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                fullWidth
              >
                login
              </Button>
            </Grid>
            <Link
              to={"/register"}
              style={{ display: "block", textAlign: "center", marginTop: 8 }}
            >
              sign up instead
            </Link>
          </CardContent>
        </Card>
      </form>
    </Box>
  );
};

export default Login;
