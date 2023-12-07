import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useMutation, useQueryClient, useQuery } from "react-query";
import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  LinearProgress,
  Radio,
  RadioGroup,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const TwoWayLinkUploadInput = () => {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const mutation = useMutation(
    async (formData) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await axiosPrivate.post(
        "/uploads/upload_unclaimed_profile/",
        formData,
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
        queryClient.invalidateQueries("unclaimed-all");
        setMessage("two way links upload processed successfully");
        setSeverity("success");
      },
    }
  );

  const handleUpload = async (event) => {
    event.preventDefault();

    // Create a FormData object and append the file and other data
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail);
        setSeverity("error");
      } else if (error.request) {
        setMessage("No response received from the server");
        setSeverity("error");
      } else {
        setMessage("Error: " + error.message);
        setSeverity("error");
      }
    }
    setOpenSnackbar(true);
  };

  const { isLoading } = mutation;

  if (isLoading) {
    return (
      <Box>
        <Typography variant="subtitle1">
          File is still being processed please wait
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container sx={{ display: "flex" }}>
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
        {!isLoading && <Box sx={{ height: 4 }} />}
      </Box>
      <Grid item xs={12}>
        <Tooltip title="upload bulk of two way link accounts">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              paddingX: "2rem",
              marginY: "1rem",
            }}
          >
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload File
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                accept=".csv, .xlsx"
              />
            </Button>

            <Typography variant="body2" color="textSecondary">
              {selectedFile
                ? `File selected: ${selectedFile.name}`
                : "No file selected"}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!selectedFile}
              style={{ marginLeft: "auto" }}
            >
              Submit
            </Button>
          </Box>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default TwoWayLinkUploadInput;
