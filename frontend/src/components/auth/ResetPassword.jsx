import axios from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "react-query";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  LinearProgress,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const ResetPassword = () => {
  const navigate = useNavigate();

  const { code } = useParams();
  const { email } = useParams();
  const [password, setPassword] = useState("");
  const [openSnackBar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  const [severity, setSeverity] = useState("error");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };


  const ResetMutation = useMutation(
    async (details) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axios.post(`/auth/password_change`, details, axiosConfig);
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
        setOpenSnackbar(true);
      },
      onSuccess: (data, variables, context) => {
        setMessage("Password Changed Successful");
        setSeverity("success");
        navigate("/login", {
          state: {
            message:
              "Successfully reset your password now please input your updated credentials",
            snackbar: "Successfully Updated!",
          },
          replace: true,
        });
      },
    }
  );

  const { isLoading: isResetLoading } = ResetMutation;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      password: password,
      email: email,
      code: code,
    };

    const payload = JSON.stringify(data);

    await ResetMutation.mutateAsync(payload);

    setOpenSnackbar(true);
  };

  return (
    <>
      {isResetLoading && (
        <Box sx={{ width: "100%", position: "fixed", top: 0 }}>
          <LinearProgress />
        </Box>
      )}
      <Snackbar
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card>
          <CardHeader
            title={<Typography variant="h4">Password Reset</Typography>}
          />
          <CardContent>
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
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              Save
            </Button>
          </CardActions>
        </Card>
      </Box>
    </>
  );
};

export default ResetPassword;
