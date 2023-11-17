import { useMutation, useQueryClient, useQuery } from "react-query";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Alert,
  Box,
  Button,
  Dialog,
  Avatar,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  Snackbar,
  LinearProgress,
  Tooltip,
  FormControlLabel,
  Switch,
  Skeleton,
  DialogContentText,
} from "@mui/material";

const EditClassificationModal = ({ open, onClose, classificationID }) => {
  const queryClient = useQueryClient();

  const getData = async () => {
    return await axiosPrivate.get(
      `/selections/classifications/${classificationID}`
    );
  };
  const { data: cachedData, isLoading: isLoadingClassification } = useQuery(
    "classification-specific",
    getData
  );
  const [classificationProfile, setClassificationProfile] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [deletePrompt, setDeletePrompt] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  useEffect(() => {
    if (cachedData) {
      setClassificationProfile({
        name: cachedData?.data?.name || "",
        code: cachedData?.data?.code || "",
      });
    }
  }, [cachedData]);

  const mutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosPrivate.put(
        `/selections/classifications/${classificationID}`,
        newProfile,
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
        queryClient.invalidateQueries("classifications-all");
        queryClient.invalidateQueries("classifications-specific");
        queryClient.invalidateQueries("profile-me");

        setMessage("classification updated successfully");
        setSeverity("success");
      },
    }
  );

  const mutationDelete = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosPrivate.delete(
        `/selections/classifications/${classificationID}`,
        axiosConfig
      );
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
        setOpenSnackbar(true);
        setIsLoadingDelete(false);
      },
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("classifications-all");
        queryClient.invalidateQueries("classifications-specific");
        queryClient.invalidateQueries("profile-me");

        setMessage("classification deleted successfully");
        setSeverity("success");
        setOpenSnackbar(true);
        console.log("nani");
        setTimeout(() => {}, 6000);
        console.log("nanii");
        setIsLoadingDelete(false);
        onClose();
      },
    }
  );

  const { isLoading } = mutation;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setClassificationProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (classificationProfile.name == "" || classificationProfile.code == "") {
      setMessage("please fill out all of the fields.");
      setSeverity("error");
      return; // Prevent form submission
    }

    const data = {
      name: classificationProfile?.name,
      code: classificationProfile?.code,
    };

    // Convert the object to a JSON string
    const payload = JSON.stringify(data);

    try {
      await mutation.mutateAsync(payload);
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
  };

  const handleDelete = async () => {
    try {
      setIsLoadingDelete(true);
      await mutationDelete.mutateAsync();
    } catch (error) {
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

  if (isLoadingClassification) {
    return (
      <Dialog open={true}>
        <DialogTitle>
          <Skeleton variant="text" />
        </DialogTitle>
        <DialogContent sx={{ width: "40vw" }}>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Box>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }
  console.log(isLoadingDelete);

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
        {(isLoading || isLoadingDelete) && <LinearProgress />}
        {!(isLoading && isLoadingDelete) && <Box sx={{ height: 4 }} />}
      </Box>
      {!deletePrompt ? (
        <Box>
          <DialogTitle>Modify Classification</DialogTitle>
          <DialogContent sx={{ width: "40vw" }}>
            <Grid container spacing={2} p={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="name"
                  value={classificationProfile?.name}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="code"
                  label="code"
                  value={classificationProfile?.code}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ padding: 3 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Box sx={{ display: "flex", ml: "auto" }}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button
                onClick={() => setDeletePrompt(true)}
                variant="contained"
                color="error"
                disabled={isLoading}
              >
                Delete
              </Button>
            </Box>
          </DialogActions>
        </Box>
      ) : (
        <Box>
          <DialogTitle>Delete Achievement</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this achievement?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeletePrompt(false)}>Cancel</Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={isLoadingDelete}
            >
              Delete
            </Button>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
};

export default EditClassificationModal;
