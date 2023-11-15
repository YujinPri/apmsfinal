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
import { stringify } from "flatted";

import {
  BusinessCenter,
  Work,
  LocalGroceryStore,
  LocalHospital,
  School,
  Build,
  AccountBalance,
  Store,
  MonetizationOn,
  Computer,
  Palette,
  LocalShipping,
  GroupWork,
  BuildCircle,
  Gavel,
  Security,
  HeadsetMic,
  Forest,
  SupervisorAccount,
  LocalOffer,
  SpeakerNotes,
  Landscape,
  Biotech,
} from "@mui/icons-material";

import Autocomplete from "@mui/material/Autocomplete";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const EditAchievementModal = ({ open, onClose, achievementID }) => {
  const queryClient = useQueryClient();

  const getData = async () => {
    return await axiosPrivate.get(`/profiles/achievement/${achievementID}`);
  };
  const { data: cachedData, isLoading: isLoadingProfile } = useQuery(
    "achievement-profile-specific",
    getData
  );
  const [achievementProfile, setAchievementProfile] = useState(null);

  useEffect(() => {
    if (cachedData) {
      setAchievementProfile({
        type_of_achievement:
          cachedData?.data?.achievement?.type_of_achievement || "",
        description: cachedData?.data?.achievement?.description || "",
        story: cachedData?.data?.achievement?.story || "",
        link_reference: cachedData?.data?.achievement?.link_reference || "",
        year_of_attainment:
          cachedData?.data?.achievement?.year_of_attainment || 0,
      });
    }
  }, [cachedData]);

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
      const response = await axiosPrivate.put(
        `/profiles/achievement/${achievementID}`,
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
        queryClient.invalidateQueries("profile-me");

        setMessage("achievement updated successfully");
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
    console.log("achievementProfile:", achievementProfile);
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

  if (isLoadingProfile) {
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
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Box>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Box>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Box>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button disabled>
            <Skeleton variant="text" />
          </Button>
          <Button disabled>
            <Skeleton variant="text" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const achievement_type = [
    {
      type: "bar exam passer",
      description: "successfully passed a bar examination.",
    },
    {
      type: "board exam passer",
      description: "successfully passed a board examination.",
    },
    {
      type: "civil service eligibility",
      description: "successfully passed a civil service exam",
    },
    {
      type: "owned a business",
      description: "successfully established my own business",
    },
    {
      type: "certifications",
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
      <DialogTitle>Edit Achievement</DialogTitle>
      <DialogContent sx={{ width: "40vw" }}>
        <Grid container spacing={2} p={2}>
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

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>achievement type</InputLabel>
              <Select
                name="achievement_type"
                value={achievementProfile?.type_of_achievement || ""}
                onChange={handleAchievementTypeChange}
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

export default EditAchievementModal;
