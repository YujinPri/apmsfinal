import React, { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useMutation, useQueryClient, useQuery } from "react-query";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "../../api/axios";
import LinkedInLogin from "./LinkedInLogin";
import { useNavigate, Link, useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Box,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Backdrop,
  CircularProgress,
} from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  const { auth, setAuth, setPersist, persist } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/home";
  const refreshMessage =
    location.state?.message || "Ready to relive Memories? Just Loginn!";
  const snackbarMessage = location.state?.snackbar || "";

  const userRef = useRef();
  const recaptcha = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [forgotPass, setForgotPass] = useState(false);
  const [open, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState("error");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    if (snackbarMessage) {
      setMessage(snackbarMessage);
      setSeverity("success");
      setOpenSnackbar(true);
    }
  }, []);

  const ResetMutation = useMutation(
    async (details) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axios.post(`/auth/password_reset`, details, axiosConfig);
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
        setOpenSnackbar(true);
      },
      onSuccess: (data, variables, context) => {
        setMessage("Password Reset Successful");
        setSeverity("success");
      },
    }
  );

  const LoginMutation = useMutation(
    async (details) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true, // Set this to true for cross-origin requests with credentials
      };

      await axios.post(`/users/auth/token`, details, axiosConfig);
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
        setOpenSnackbar(true);
      },
      onSuccess: (response) => {
        const data = response?.data;
        setAuth(username, data?.role, data?.access_token);
        navigate(from, { replace: true });
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataString =
      "grant_type=&username=" +
      username +
      "&password=" +
      password +
      "&scope=&client_id=&client_secret=";

    await LoginMutation.mutateAsync(dataString);

    setOpenSnackbar(true);
  };

  const handleSubmitForgotPassword = async (e) => {
    e.preventDefault();

    const captchaValue = recaptcha.current.getValue();
    if (!captchaValue) {
      setMessage("Please Verify the reCAPTCHA");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if (!email) {
      setMessage("Input Email");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const data = {
      email: email,
      recaptcha: captchaValue,
    };

    const payload = JSON.stringify(data);
    setForgotPass(false);

    await ResetMutation.mutateAsync(payload);

    setOpenSnackbar(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleChange = (event) => {
    setPersist(event.target.checked);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  const { isLoading: isLoginLoading } = LoginMutation;
  const { isLoading: isResetLoading } = ResetMutation;

  return (
    <>
      <Dialog open={forgotPass} onClose={() => setForgotPass(false)}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <Typography variant="subtitle1">
            Please input your Registered Email account
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              name="email"
              label="Email"
              type="email"
              placeholder="Input Email"
              variant="outlined"
              fullWidth
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              value={email}
              required
            />
            <ReCAPTCHA
              ref={recaptcha}
              sitekey={`${import.meta.env.VITE_RECAPTCHA_HTML_KEY}`}
            />
          </Box>
          <Typography variant="body2">
            After a successful transaction please check your email and follow
            the emailed instruction there
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: 3 }}>
          <Button onClick={() => setForgotPass(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitForgotPassword}
            variant="contained"
            color="primary"
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
      {(isLoginLoading || isResetLoading) && (
        <Box sx={{ width: "100%", position: "fixed", top: 0 }}>
          <LinearProgress />
        </Box>
      )}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            maxWidth: 600,
            padding: "20px 5px",
          }}
        >
          <CardContent>
            <Typography variant="h5">Alumni Login</Typography>
            <Typography
              color="textSecondary"
              variant="body2"
              component="p"
              my={2}
            >
              {refreshMessage}
            </Typography>
            <Grid container spacing={1.5}>
              <Grid xs={12} item>
                <TextField
                  label="Username"
                  inputRef={userRef}
                  placeholder="input username"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Grid>

              <Grid
                item
                xs={12}
                display={"flex"}
                flexDirection={"column"}
                gap={1}
              >
                <TextField
                  label="Password"
                  placeholder="Input password"
                  variant="outlined"
                  fullWidth
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  required
                />
                <Typography
                  sx={{ cursor: "pointer" }}
                  onClick={() => setForgotPass(true)}
                  variant="body2"
                >
                  Forgot Password?
                </Typography>
              </Grid>
              <Box p={2} sx={{ width: "100%", m: "0 auto" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  fullWidth
                  onClick={handleSubmit}
                >
                  login
                </Button>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={persist}
                      onChange={handleChange}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="remember me on this device"
                />
              </Box>
            </Grid>
            <LinkedInLogin />
            <Link
              to="/register"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              sign up instead
            </Link>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default Login;
