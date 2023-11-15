import { useMutation, useQueryClient, useQuery } from "react-query";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Box,
  LinearProgress,
  Alert,
} from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const DeleteAchievementModal = ({ open, onClose, achievementID }) => {
  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosPrivate.delete(
        `/profiles/achievement/${achievementID}`,
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
        queryClient.invalidateQueries("achievements-profile");
        queryClient.invalidateQueries("profile-me");

        setMessage("achievement profile deleted successfully");
        setSeverity("success");
      },
    }
  );

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await mutation.mutateAsync();
      setIsLoading(false);
      setMessage("achievement deleted successfully");
      setSeverity("success");
      setOpenSnackbar(true);
      onClose();
    } catch (error) {
      setIsLoading(false);
      setMessage(error.response ? error.response.data.detail : error.message);
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <Box sx={{ width: "100%", position: "relative", top: 0 }}>
        {isLoading && <LinearProgress />}
        {!isLoading && <Box sx={{ height: 4 }} />}
      </Box>
      <DialogTitle>Delete Achievement</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this achievement?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={isLoading}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAchievementModal;
