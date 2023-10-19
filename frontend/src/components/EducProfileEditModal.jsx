import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
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
} from "@mui/material";

import {
  LibraryBooks as LibraryBooksIcon,
  School as SchoolIcon,
  EmojiPeople as EmojiPeopleIcon,
  Create as CreateIcon,
  LocalLibrary as LocalLibraryIcon,
  SportsSoccer as SportsSoccerIcon,
  Public as PublicIcon,
  Lightbulb as LightbulbIcon,
  Star as StarIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  BusinessCenter as BusinessCenterIcon,
  Flight as FlightIcon,
  People as PeopleIcon,
  SwapHoriz as SwapHorizIcon,
  FamilyRestroom as FamilyRestroomIcon,
} from "@mui/icons-material";

import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const EducProfileEditModal = ({
  open,
  onClose,
  educProfilePrev,
  setUpdate,
}) => {
  const [educProfile, setEducProfile] = useState({
    year_graduated: educProfilePrev?.year_graduated || null,
    degree: educProfilePrev?.degree || "",
    field: educProfilePrev?.field || "",
    achievements_story: educProfilePrev?.achievements_story || "",
    post_grad_act: educProfilePrev?.post_grad_act || [],
    honors_and_awards: educProfilePrev?.honors_and_awards || [],
    civil_service_eligibility:
      educProfilePrev?.civil_service_eligibility || false,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (date) => {
    const year = date.getFullYear(); // Extract the year from the date object
    setEducProfile((prevState) => ({
      ...prevState,
      year_graduated: parseInt(year), // Convert the year to an integer
    }));
  };

  const handleDegreeAndField = (degree, field) => {
    setEducProfile((prevState) => ({
      ...prevState,
      degree: degree,
      field: field,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const year_graduated =
      educProfile?.year_graduated == educProfilePrev?.year_graduated
        ? ""
        : educProfile?.year_graduated;
    const degree =
      educProfile?.degree == educProfilePrev?.degree ? "" : educProfile?.degree;
    const field =
      educProfile?.field == educProfilePrev?.field ? "" : educProfile?.field;
    const achievements_story =
      educProfile?.achievements_story == educProfilePrev?.achievements_story
        ? ""
        : educProfile?.achievements_story;

    // Handle list-like fields differently
    const post_grad_act =
      JSON.stringify(educProfile?.post_grad_act) ==
      JSON.stringify(educProfilePrev?.post_grad_act)
        ? []
        : educProfile?.post_grad_act;
    const honors_and_awards =
      JSON.stringify(educProfile?.honors_and_awards) ==
      JSON.stringify(educProfilePrev?.honors_and_awards)
        ? []
        : educProfile?.honors_and_awards;

    const payload = new FormData();
    payload.append("year_graduated", year_graduated);
    payload.append("degree", degree);
    payload.append("field", field);
    payload.append("achievements_story", achievements_story);
    payload.append("post_grad_act", JSON.stringify(post_grad_act));
    payload.append("honors_and_awards", JSON.stringify(honors_and_awards));

    try {
      const axiosConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      // Make the PUT request to your FastAPI endpoint
      const response = await axiosPrivate.put(
        "/profiles/educational_profiles/",
        payload,
        axiosConfig
      );

      const data = response?.data;

      if (response.status !== 200) {
        setMessage(data.detail);
        setSeverity("error");
      } else {
        setMessage("Profile updated successfully");
        setSeverity("success");
        setUpdate(true);
        onClose();
      }
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
    setLoading(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const postGradActOptions = [
    {
      value: "Employment",
      label: "Employment",
      tooltip: "This covers any form of work or employment.",
      icon: <WorkIcon />,
    },
    {
      value: "Education",
      label: "Education",
      tooltip:
        "Encompasses further education, postgraduate studies, or pursuing additional certifications.",
      icon: <SchoolIcon />,
    },
    {
      value: "Internship",
      label: "Internship or Training",
      tooltip:
        "Involves internships, professional training, or gaining practical experience.",
      icon: <BusinessCenterIcon />,
    },
    {
      value: "Freelancing",
      label: "Freelancing or Self-Employment",
      tooltip: "Includes freelance work or starting a business venture.",
      icon: <BusinessIcon />,
    },
    {
      value: "Travel",
      label: "Travel or Personal Time",
      tooltip:
        "Covers travel, taking time off for personal reasons, or a gap year.",
      icon: <FlightIcon />,
    },
    {
      value: "Volunteering",
      label: "Volunteering or Social Service",
      tooltip:
        "Involves volunteering or engaging in social service activities.",
      icon: <PeopleIcon />,
    },
    {
      value: "CareerTransition",
      label: "Career Transition",
      tooltip: "Represents changing career paths or industries.",
      icon: <SwapHorizIcon />,
    },
    {
      value: "PersonalResponsibilities",
      label: "Family or Personal Responsibilities",
      tooltip:
        "Includes responsibilities related to family, marriage, or personal matters.",
      icon: <FamilyRestroomIcon />,
    },
  ];

  const degreeOptions = [
    {
      title:
        "(BBTLEDHE) Bachelor of Business Technology and Livelihood Education major in Home Economics",
      degree: "Bachelor of Business Technology and Livelihood Education",
      field: "Major in Home Economics",
    },
    {
      title:
        "(BSBAHRM) Bachelor of Science in Business Administration major in Human Resource Management",
      degree: "Bachelor of Science in Business Administration",
      field: "Major in Human Resource Management",
    },
    {
      title:
        "(BSBA-MM) Bachelor of Science in Business Administration major in Marketing Management",
      degree: "Bachelor of Science in Business Administration",
      field: "Major in Marketing Management",
    },
    {
      title: "(BSENTREP) Bachelor of Science in Entrepreneurship",
      degree: "Bachelor of Science",
      field: "in Entrepreneurship",
    },
    {
      title: "(BSIT) Bachelor of Science in Information Technology",
      degree: "Bachelor of Science",
      field: "in Information Technology",
    },
    {
      title:
        "(BPAPFM) Bachelor of Public Administration major in Public Financial Management",
      degree: "Bachelor of Public Administration",
      field: "in Public Financial Management",
    },
    {
      title:
        "(DOMTMOM) Diploma in Office Management Technology Medical Office Management",
      degree: "Diploma in Office Management Technology",
      field: "Medical Office Management",
    },
  ];

  const honorsAwardsOptions = [
    {
      value: "DeansListAward",
      label: "Dean's List Award",
      icon: <LibraryBooksIcon />,
    },
    {
      value: "AcademicExcellenceAward",
      label: "Academic Excellence Award",
      icon: <SchoolIcon />,
    },
    {
      value: "LeadershipAndServiceAward",
      label: "Leadership and Service Award",
      icon: <EmojiPeopleIcon />,
    },
    {
      value: "ResearchAchievementAward",
      label: "Research Achievement Award",
      icon: <CreateIcon />,
    },
    {
      value: "BestThesisDissertationAward",
      label: "Best Thesis/Dissertation Award",
      icon: <LocalLibraryIcon />,
    },
    {
      value: "OutstandingAlumnusAlumnaAward",
      label: "Outstanding Alumnus/Alumna Award",
      icon: <StarIcon />,
    },
    {
      value: "SportsAchievementAward",
      label: "Sports Achievement Award",
      icon: <SportsSoccerIcon />,
    },
    {
      value: "CommunityServiceRecognition",
      label: "Community Service Recognition",
      icon: <PublicIcon />,
    },
    {
      value: "InnovationEntrepreneurshipAward",
      label: "Innovation and Entrepreneurship Award",
      icon: <LightbulbIcon />,
    },
    {
      value: "SpecialRecognitionContributionsField",
      label: "Special Recognition for Contributions to a Field",
      icon: <StarIcon />,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              id="degree-field"
              options={degreeOptions}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => (
                <TextField {...params} label="Degree and Field" />
              )}
              onChange={(event, newValue) => {
                if (newValue) {
                  handleDegreeAndField(newValue.degree, newValue.field);
                } else {
                  // Handle the case where nothing is selected, e.g., clear the values.
                  handleDegreeAndField("", "");
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Enter text"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={educProfile.achievements_story}
              onChange={(event) => {
                const { value } = event.target;
                setEducProfile({
                  ...educProfile,
                  achievements_story: value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]} sx={{ width: "100%" }}>
                <DemoItem>
                  <DatePicker
                    views={["year"]}
                    label="Year graduated"
                    value={dayjs(`${educProfile.year_graduated}-01-01`)}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <InputLabel id="honors-awards-label">
                Honors and Awards
              </InputLabel>
              <Select
                labelId="honors-awards-label"
                multiple
                value={educProfile.honors_and_awards}
                onChange={(event) => {
                  setEducProfile({
                    ...educProfile,
                    honors_and_awards: event.target.value, // Update honors_and_awards
                  });
                }}
                renderValue={(selected) => (
                  <Box>
                    {selected.map((value) => {
                      const selectedOption = honorsAwardsOptions.find(
                        (option) => option.value === value
                      );
                      if (selectedOption) {
                        return (
                          <Chip
                            key={value}
                            label={selectedOption.label}
                            icon={selectedOption.icon}
                          />
                        );
                      }
                      return null;
                    })}
                  </Box>
                )}
              >
                {honorsAwardsOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <InputLabel id="post-grad-act-label">Post Grad Act</InputLabel>
              <Select
                labelId="post-grad-act-label"
                multiple
                value={educProfile.post_grad_act}
                onChange={(event) => {
                  setEducProfile({
                    ...educProfile,
                    post_grad_act: event.target.value, // Update post_grad_act
                  });
                }}
                renderValue={(selected) => (
                  <Box>
                    {selected.map((value) => {
                      const selectedOption = postGradActOptions.find(
                        (option) => option.value === value
                      );
                      if (selectedOption) {
                        return (
                          <Chip
                            key={value}
                            label={selectedOption.label}
                            icon={selectedOption.icon}
                          />
                        );
                      }
                      return null; // Handle cases where the option with the selected value doesn't exist
                    })}
                  </Box>
                )}
              >
                {postGradActOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Save
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
      {loading ? (
        <Box sx={{ width: "100%", position: "fixed", top: 0 }}>
          <LinearProgress />
        </Box>
      ) : null}
    </Dialog>
  );
};

export default EducProfileEditModal;
