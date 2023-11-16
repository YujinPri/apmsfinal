import cloneDeep from "lodash/cloneDeep";
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
} from "@mui/material";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const AddAchievementModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  const [achievementProfile, setAchievementProfile] = useState(null);

  useEffect(() => {
    setAchievementProfile({
      type_of_achievement: "",
      description: "",
      story: "",
      link_reference: "",
      year_of_attainment: 0,
    });
  }, []);

  const handleDateChange = (date) => {
    const year = date.year();
    setAchievementProfile((prevProfile) => ({
      ...prevProfile,
      year_of_attainment: year,
    }));
  };

  const handleAchievementTypeChange = (event) => {
    const selectedAchievementType = event.target.value;
    const selectedAchievement = achievement_type.find(
      (achievement) => achievement.type === selectedAchievementType
    );

    setAchievementProfile((prevProfile) => ({
      ...prevProfile,
      type_of_achievement: selectedAchievementType,
      description: selectedAchievement?.description || "",
    }));
  };

  const mutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosPrivate.post(
        "/profiles/achievement/",
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
        queryClient.invalidateQueries("achievements-profile");
        queryClient.invalidateQueries("career-profile");
        queryClient.invalidateQueries("profile-me");

        setMessage("Achievement Profile Added Successfully");
        setSeverity("success");
      },
    }
  );

  const { isLoading, isError, error, isSuccess } = mutation;

  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAchievementProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      achievementProfile.type_of_achievement == "" ||
      achievementProfile.description == "" ||
      achievementProfile.year_of_attainment == 0
    ) {
      setMessage("please fill out all of the fields.");
      setSeverity("error");
      setOpenSnackbar(true);
      return; // Prevent form submission
    }

    const data = {
      type_of_achievement: achievementProfile?.type_of_achievement,
      description: achievementProfile?.description,
      story: achievementProfile?.story,
      link_reference: achievementProfile?.link_reference,
      year_of_attainment: achievementProfile?.year_of_attainment,
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
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const achievement_type = [
    {
      type: "Bar Exam Passer",
      description: "successfully passed a bar examination.",
    },
    {
      type: "Board Exam Passer",
      description: "successfully passed a board examination.",
    },
    {
      type: "Civil Service Eligibility",
      description: "successfully passed a civil service exam",
    },
    {
      type: "Owned a Business",
      description: "successfully established my own business",
    },
    {
      type: "Certifications",
      description: "succesfully received a special certification",
    },
  ];

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
      <DialogTitle>Add Achievement History</DialogTitle>
      <DialogContent sx={{ width: "40vw" }}>
        <Grid container spacing={2} p={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>achievement type</InputLabel>
              <Select
                name="achievement_type"
                onChange={handleAchievementTypeChange}
                value={achievementProfile?.type_of_achievement || ""}
              >
                {achievement_type.map((option) => (
                  <MenuItem key={option.type} value={option.type}>
                    {option.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="description of the achievements"
              value={achievementProfile?.description || ""}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]} sx={{ width: "100%" }}>
                <DemoItem>
                  <DatePicker
                    views={["year"]}
                    label="year attained"
                    value={
                      achievementProfile?.year_of_attainment
                        ? dayjs(
                            `${achievementProfile?.year_of_attainment}-01-01`
                          )
                        : null
                    }
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="link_reference"
              label="supporting links for the achievement (optional)"
              value={achievementProfile?.link_reference || ""}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="story"
              label="story of your achievement (optional)"
              value={achievementProfile?.story || ""}
              onChange={handleChange}
              sx={{ width: "100%" }}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAchievementModal;
