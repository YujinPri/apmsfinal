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
  Skeleton,
  OutlinedInput,
  Chip,
  DialogContentText,
} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditCourseModal = ({ open, onClose, courseID }) => {
  const queryClient = useQueryClient();
  const classificationsData = queryClient.getQueryData("classifications-all");
  const isLoadingClassification = queryClient.isFetching("classifications-all");
  const [courseProfile, setCourseProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [classificationIds, setClassificationIds] = useState([]);
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [deletePrompt, setDeletePrompt] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const getData = async () => {
    return await axiosPrivate.get(`/selections/courses/${courseID}`);
  };
  const {
    data: cachedData,
    isLoading: isLoadingCourse,
    isFetching: isFetchingCourse,
  } = useQuery("course-specific", getData);

  useEffect(() => {
    const classifications =
      cachedData?.data?.classifications?.map(
        (item) => item.classification_id
      ) || [];
    if (cachedData) {
      setClassificationIds(
        // On autofill we get a stringified classifications.
        typeof classifications === "string"
          ? classifications.split(",")
          : classifications
      );
      setCourseProfile({
        name: cachedData?.data?.course?.name || "",
        classification_ids:
          cachedData?.data?.classifications?.map(
            (item) => item.classification_id
          ) || [],
      });
    }
  }, [cachedData]);

  const handleChangeSelect = (event) => {
    const {
      target: { value },
    } = event;
    setClassificationIds(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    setCourseProfile((prevProfile) => ({
      ...prevProfile,
      classification_ids: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourseProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const mutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosPrivate.put(
        `/selections/courses/${courseID}`,
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
        queryClient.invalidateQueries("courses-all");
        queryClient.invalidateQueries("courses-specific");
        queryClient.invalidateQueries("profile-me");
        queryClient.invalidateQueries("career-profile");
        queryClient.invalidateQueries("employment-profile");

        setMessage("course updated successfully");
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
        `/selections/courses/${courseID}`,
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
        queryClient.invalidateQueries("courses-all");
        queryClient.invalidateQueries("courses-specific");
        queryClient.invalidateQueries("profile-me");
        queryClient.invalidateQueries("career-profile");
        queryClient.invalidateQueries("employment-profile");

        setMessage("course deleted successfully");
        setSeverity("success");
        setOpenSnackbar(true);
        setIsLoadingDelete(false);
        onClose();
      },
    }
  );

  const { isLoading } = mutation;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (courseProfile.name == "") {
      setMessage("please fill out all of the fields.");
      setSeverity("error");
      setOpenSnackbar(true);
      return; // Prevent form submission
    }

    const data = {
      name: courseProfile?.name,
      classification_ids: courseProfile?.classification_ids,
    };
    // Convert the object to a JSON string
    const payload = JSON.stringify(data);

    console.log(payload);

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
    setOpenSnackbar(true);
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

  if (isLoadingCourse || isFetchingCourse) {
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

  const classifications = classificationsData?.data;

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
          <DialogTitle>Add Course</DialogTitle>
          <DialogContent sx={{ width: "40vw" }}>
            <Grid container spacing={2} p={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="name"
                  value={courseProfile?.name}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel>related classifications</InputLabel>
                  <Select
                    multiple
                    value={classificationIds}
                    onChange={handleChangeSelect}
                    input={<OutlinedInput label="Chip" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={
                              classifications.find(
                                (classification) => classification.id === value
                              ).name
                            }
                          />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {classifications.map((classification) => (
                      <MenuItem
                        key={classification.id}
                        value={classification.id}
                      >
                        {classification.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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

export default EditCourseModal;
