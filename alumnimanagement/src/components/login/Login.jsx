import React, { useContext, useState } from "react";
import { styled } from "@mui/material/styles";
// import { UserContext } from "../../context/UserContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const [, setToken] = useContext(UserContext);
  const [open, setOpen] = React.useState(false);

  const submitRegistration = async () => {
    try {
      const response = await axios.post("http://localhost:8000/user/", {
        username: username,
        plain_password: password,
      });

      const data = response.data;

      if (response.status !== 200) {
        setErrorMessage(data.detail);
      } else {
        // setToken(data.access_token);
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
    submitRegistration();
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
              alumni login
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

              <Grid item xs={12} sm={12}>
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
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default Login;
