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
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const DeleteEmploymentModal = ({ open, onClose, employmentID }) => {
  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const getData = async () => {
    return await axiosPrivate.get(
      `/profiles/employment_profiles/${employmentID}`
    );
  };
  const { data: cachedData } = useQuery("employment-profile-specific", getData);

  const mutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosPrivate.delete(
        `/profiles/employment_profiles/${employmentID}`,
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
        queryClient.invalidateQueries("employment-profile");
        queryClient.invalidateQueries("profile-me");

        setMessage("employment profile deleted successfully");
        setSeverity("success");
      },
    }
  );

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await mutation.mutateAsync();
      setIsLoading(false);
      setMessage("employment profile deleted successfully");
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
      <DialogTitle>Delete Employment Profile</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this employment profile?
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      {isLoading ? (
        <Box sx={{ width: "100%", position: "fixed", top: 0 }}>
          <LinearProgress />
        </Box>
      ) : null}
    </Dialog>
  );
};

export default DeleteEmploymentModal;
