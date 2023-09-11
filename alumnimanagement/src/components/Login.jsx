import React, { useState } from "react";
import { useAuth } from "../context/UserContext";
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

const Login = ({ user }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate(); // Get the navigate function
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = useState("error");

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

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/auth/token",
        dataString,
        {
          headers,
        }
      );
      const data = response.data;

      if (response.status !== 200) {
        setMessage(data.detail);
        setSeverity("error")
      } else {
        setToken(data.access_token);
        navigate("/home");
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail);
        setSeverity("error")
      } else if (error.request) {
        setMessage("No response received from the server");
        setSeverity("error")
      } else {
        setMessage("Error:" + error.message);
        setSeverity("error")
      }
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
              {user} login
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
    </div>
  );
};

export default Login;
