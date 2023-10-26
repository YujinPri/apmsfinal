import { useMutation, useQueryClient, useQuery } from "react-query";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

const EducProfileEditModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  const getData = async () => {
    return await axiosPrivate.get("/profiles/educational_profile/me");
  };
  const { data: cachedData } = useQuery("educational-profile", getData);

  const [educProfile, setEducProfile] = useState(null);

  useEffect(() => {
    if (cachedData) {
      setEducProfile({
        ...cachedData.data,
        year_graduated: cachedData?.data?.year_graduated || null,
        degree: cachedData?.data?.degree || "",
        field: cachedData?.data?.field || "",
        achievements_story: cachedData?.data?.achievements_story || "",
        post_grad_act: cachedData?.data?.post_grad_act || [],
        honors_and_awards: cachedData?.data?.honors_and_awards || [],
        civil_service_eligibility:
          cachedData?.data?.civil_service_eligibility || false,
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
        "/profiles/educational_profiles/",
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
        queryClient.invalidateQueries("educational-profile");
        queryClient.invalidateQueries("profile-me");

        setMessage("Educational Profile updated successfully");
        setSeverity("success");
      },
    }
  );

  const { isLoading, isError, error, isSuccess } = mutation;

  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleDateChange = (date) => {
    const year = date.year();
    setEducProfile((prevProfile) => ({
      ...prevProfile,
      year_graduated: year,
    }));
    console.log(educProfile.year_graduated);
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
    console.log(typeof educProfile?.year_graduated);
    console.log(typeof cachedData?.data?.year_graduated);
    console.log(educProfile?.year_graduated);
    console.log(cachedData?.data?.year_graduated);
    const data = {
      year_graduated:
        educProfile?.year_graduated === cachedData?.data?.year_graduated
          ? null
          : educProfile?.year_graduated,
      degree:
        educProfile?.degree === cachedData?.data?.degree
          ? null
          : educProfile?.degree,
      field:
        educProfile?.field === cachedData?.data?.field
          ? null
          : educProfile?.field,
      achievements_story:
        educProfile?.achievements_story === cachedData?.data?.achievements_story
          ? null
          : educProfile?.achievements_story,
      post_grad_act: educProfile?.post_grad_act,
      honors_and_awards: educProfile?.honors_and_awards,
    };

    // Filter out null values
    const filteredData = Object.keys(data).reduce((acc, key) => {
      if (data[key] !== null) {
        acc[key] = data[key];
      }
      return acc;
    }, {});

    // Convert the object to a JSON string
    const payload = JSON.stringify(filteredData);

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
      value: "Career Transition",
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
      value: "Deans Award",
      label: "Dean's List Award",
      icon: <LibraryBooksIcon />,
    },
    {
      value: "Academic Award",
      label: "Academic Excellence Award",
      icon: <SchoolIcon />,
    },
    {
      value: "Service Award",
      label: "Leadership and Service Award",
      icon: <EmojiPeopleIcon />,
    },
    {
      value: "Research Award",
      label: "Research Achievement Award",
      icon: <CreateIcon />,
    },
    {
      value: "Thesis Award",
      label: "Best Thesis/Dissertation Award",
      icon: <LocalLibraryIcon />,
    },
    {
      value: "Alumnus Award",
      label: "Outstanding Alumnus/Alumna Award",
      icon: <StarIcon />,
    },
    {
      value: "Sports Award",
      label: "Sports Achievement Award",
      icon: <SportsSoccerIcon />,
    },
    {
      value: "Service Recognition",
      label: "Community Service Recognition",
      icon: <PublicIcon />,
    },
    {
      value: "Innovation Award",
      label: "Innovation and Entrepreneurship Award",
      icon: <LightbulbIcon />,
    },
    {
      value: "Contributions Award",
      label: "Special Recognition for Contributions to a Field",
      icon: <StarIcon />,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={2}>
          <Grid item xs={12}>
            <Autocomplete
              id="degree-field"
              options={degreeOptions}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Degree and Field"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />
              )}
              onChange={(event, newValue) => {
                if (newValue) {
                  handleDegreeAndField(newValue.degree, newValue.field);
                } else {
                  // Handle the case where nothing is selected, e.g., clear the values.
                  handleDegreeAndField("", "");
                }
              }}
              defaultValue={degreeOptions.find(
                (option) => option.field === educProfile?.field
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Achievements Story"
              multiline
              rows={10}
              variant="outlined"
              fullWidth
              value={educProfile?.achievements_story}
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
                    value={
                      educProfile?.year_graduated
                        ? dayjs(`${educProfile.year_graduated}-01-01`)
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
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="honors-awards-label">
                Honors and Awards
              </InputLabel>
              <Select
                labelId="honors-awards-label"
                multiple
                value={educProfile?.honors_and_awards}
                onChange={(event) => {
                  setEducProfile({
                    ...educProfile,
                    honors_and_awards: event.target.value, // Update honors_and_awards
                  });
                }}
                renderValue={(selected) => (
                  <Box
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "flex",
                      flexDirection: "column",
                      width: "60%",
                      margin: "0 auto",
                      gap: 5,
                    }}
                  >
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
                      return null; // Handle cases where the option with the selected value doesn't exist
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
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="post-grad-act-label">Post Grad Act</InputLabel>
              <Select
                labelId="post-grad-act-label"
                multiple
                value={educProfile?.post_grad_act}
                onChange={(event) => {
                  setEducProfile({
                    ...educProfile,
                    post_grad_act: event.target.value, // Update post_grad_act
                  });
                }}
                renderValue={(selected) => (
                  <Box
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "flex",
                      flexDirection: "column",
                      width: "60%",
                      margin: "0 auto",
                      gap: 5,
                    }}
                  >
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
          disabled={isLoading}
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
      {isLoading ? (
        <Box sx={{ width: "100%", position: "fixed", top: 0 }}>
          <LinearProgress />
        </Box>
      ) : null}
    </Dialog>
  );
};

export default EducProfileEditModal;
