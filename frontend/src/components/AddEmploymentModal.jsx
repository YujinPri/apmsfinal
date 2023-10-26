import cloneDeep from "lodash/cloneDeep";
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
  FormControlLabel,
  Switch,
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

const AddEmploymentModal = ({ open, onClose, employmentID }) => {
  const queryClient = useQueryClient();
  
  const [employmentProfile, setEmploymentProfile] = useState(null);

  useEffect(() => {
    setEmploymentProfile({
      company_name: "",
      job_title: "",
      date_hired: null,
      current_job: false,
      aligned_with_academic_program: false,
      date_end: null,
      classification: "",
      gross_monthly_income: "",
      employment_contract: "",
      job_level_position: "",
      type_of_employer: "",
      location_of_employment: "",
    });
  }, []);

  const mutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosPrivate.post(
        "/profiles/employment_profiles/",
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
        queryClient.invalidateQueries("employment-profile");
        queryClient.invalidateQueries("profile-me");

        setMessage("Employment Profile updated successfully");
        setSeverity("success");
      },
    }
  );

  const { isLoading, isError, error, isSuccess } = mutation;

  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    console.log(employmentProfile);
  }, [employmentProfile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEmploymentProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleToggle = (event) => {
    setEmploymentProfile((prevProfile) => ({
      ...prevProfile,
      aligned_with_academic_program: event.target.checked,
    }));
  };
  const handleToggleCurrentJob = (event) => {
    setEmploymentProfile((prevProfile) => ({
      ...prevProfile,
      current_job: event.target.checked,
    }));
  };
  const handleClassification = (value) => {
    setEmploymentProfile((prevProfile) => ({
      ...prevProfile,
      classification: value,
    }));
  };
  const handleDateHiredChange = (date) => {
    setEmploymentProfile((prevProfile) => ({
      ...prevProfile,
      date_hired: date,
    }));
  };

  const handleDateEndChange = (date) => {
    setEmploymentProfile((prevProfile) => ({
      ...prevProfile,
      date_end: date,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      employmentProfile.company_name == "" ||
      employmentProfile.job_title == "" ||
      employmentProfile.date_hired == null ||
      (!employmentProfile.current_job && employmentProfile.date_end == null) ||
      employmentProfile.classification == "" ||
      employmentProfile.gross_monthly_income == "" ||
      employmentProfile.employment_contract == "" ||
      employmentProfile.job_level_position == "" ||
      employmentProfile.type_of_employer == "" ||
      employmentProfile.location_of_employment == ""
    ) {
      setMessage("please fill out all of the fields.");
      setSeverity("error");
      setOpenSnackbar(true);
      return; // Prevent form submission
    }

    const now = new Date(); // Get the current date
    let date_end = employmentProfile?.date_end || now;

    console.log(date_end <= employmentProfile?.date_hired);

    if (
      date_end <= employmentProfile?.date_hired ||
      date_end > now ||
      employmentProfile?.date_hired > now
    ) {
      setMessage("invalid date range.");
      setSeverity("error");
      setOpenSnackbar(true);
      return; // Prevent form submission
    }
    

    const data = {
      company_name: employmentProfile?.company_name,
      job_title: employmentProfile?.job_title,
      date_hired: employmentProfile?.date_hired.format("YYYY-MM-DD"),
      date_end: employmentProfile?.date_end?.format("YYYY-MM-DD"),
      classification: employmentProfile?.classification,
      aligned_with_academic_program: employmentProfile?.aligned_with_academic_program,
      gross_monthly_income: employmentProfile?.gross_monthly_income,
      employment_contract: employmentProfile?.employment_contract,
      job_level_position: employmentProfile?.job_level_position,
      type_of_employer: employmentProfile?.type_of_employer,
      location_of_employment: employmentProfile?.location_of_employment,
    };

    if (employmentProfile?.current_job) data.date_end = null;

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
    console.log("shisaaaha");
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const classification = [
    {
      value: "Management and Leadership",
      label: "Management and Leadership",
      icon: <BusinessCenter />,
    },
    {
      value: "Professional and Technical",
      label: "Professional and Technical",
      icon: <AccountBalance />,
    },
    {
      value: "Office and Administrative",
      label: "Office and Administrative",
      icon: <Work />,
    },
    {
      value: "Sales and Customer Service",
      label: "Sales and Customer Service",
      icon: <LocalGroceryStore />,
    },
    {
      value: "Healthcare and Medical",
      label: "Healthcare and Medical",
      icon: <LocalHospital />,
    },
    {
      value: "Education and Training",
      label: "Education and Training",
      icon: <School />,
    },
    {
      value: "Manufacturing and Production",
      label: "Manufacturing and Production",
      icon: <Build />,
    },
    {
      value: "Retail and Hospitality",
      label: "Retail and Hospitality",
      icon: <Store />,
    },
    {
      value: "Finance and Accounting",
      label: "Finance and Accounting",
      icon: <MonetizationOn />,
    },
    {
      value: "Information Technology (IT)",
      label: "Information Technology (IT)",
      icon: <Computer />,
    },
    {
      value: "Engineering and Technical",
      label: "Engineering and Technical",
      icon: <BuildCircle />,
    },
    {
      value: "Creative and Arts",
      label: "Creative and Arts",
      icon: <Palette />,
    },
    {
      value: "Agriculture and Farming",
      label: "Agriculture and Farming",
      icon: <Forest />,
    },
    {
      value: "Transportation and Logistics",
      label: "Transportation and Logistics",
      icon: <LocalShipping />,
    },
    {
      value: "Social Services and Nonprofit",
      label: "Social Services and Nonprofit",
      icon: <GroupWork />,
    },
    {
      value: "Legal and Law Enforcement",
      label: "Legal and Law Enforcement",
      icon: <Gavel />,
    },
    {
      value: "Military and Defense",
      label: "Military and Defense",
      icon: <Security />,
    },
    {
      value: "Construction and Trades",
      label: "Construction and Trades",
      icon: <Build />,
    },
    {
      value: "Science and Research",
      label: "Science and Research",
      icon: <Biotech />,
    },
    {
      value: "Customer Support and Call Centers",
      label: "Customer Support and Call Centers",
      icon: <HeadsetMic />,
    },
    {
      value: "Environmental and Sustainability",
      label: "Environmental and Sustainability",
      icon: <Landscape />,
    },
    {
      value: "Human Resources and Recruitment",
      label: "Human Resources and Recruitment",
      icon: <SupervisorAccount />,
    },
    {
      value: "Marketing and Advertising",
      label: "Marketing and Advertising",
      icon: <LocalOffer />,
    },
    {
      value: "Consulting and Advising",
      label: "Consulting and Advising",
      icon: <SpeakerNotes />,
    },
  ];

  const monthlyGrossIncome = [
    {
      value: "Less than ₱9,100",
    },
    {
      value: "₱9,100 to ₱18,200",
    },
    {
      value: "₱18,200 to ₱36,400",
    },
    {
      value: "₱36,400 to ₱63,700",
    },
    {
      value: "₱63,700 to ₱109,200",
    },
    {
      value: "₱109,200 to ₱182,000",
    },
    {
      value: "Above ₱182,000",
    },
  ];

  const employmentContract = [
    {
      value: "Regular",
    },
    {
      value: "Casual",
    },
    {
      value: "Project",
    },
    {
      value: "Seasonal",
    },
    {
      value: "Fixed-term",
    },
    {
      value: "Probationary",
    },
  ];

  const jobLevelPosition = [
    {
      value: "Entry Level",
    },
    {
      value: "Junior",
    },
    {
      value: "Mid-Level",
    },
    {
      value: "Senior",
    },
    {
      value: "Director",
    },
  ];

  const employerType = [
    {
      value: "Public",
    },
    {
      value: "Private",
    },
  ];

  const locationOfEmployment = [
    {
      value: "International",
    },
    {
      value: "Local",
    },
  ];

  const classifications = [
    {
      value: "Management and Leadership",
      label: "Management and Leadership",
    },
    {
      value: "Professional and Technical",
      label: "Professional and Technical",
    },
    {
      value: "Office and Administrative",
      label: "Office and Administrative",
    },
    {
      value: "Sales and Customer Service",
      label: "Sales and Customer Service",
    },
    {
      value: "Healthcare and Medical",
      label: "Healthcare and Medical",
    },
    {
      value: "Education and Training",
      label: "Education and Training",
    },
    {
      value: "Manufacturing and Production",
      label: "Manufacturing and Production",
    },
    {
      value: "Retail and Hospitality",
      label: "Retail and Hospitality",
    },
    {
      value: "Finance and Accounting",
      label: "Finance and Accounting",
    },
    {
      value: "Information Technology (IT)",
      label: "Information Technology (IT)",
    },
    {
      value: "Engineering and Technical",
      label: "Engineering and Technical",
    },
    {
      value: "Creative and Arts",
      label: "Creative and Arts",
    },
    {
      value: "Agriculture and Farming",
      label: "Agriculture and Farming",
    },
    {
      value: "Transportation and Logistics",
      label: "Transportation and Logistics",
    },
    {
      value: "Social Services and Nonprofit",
      label: "Social Services and Nonprofit",
    },
    {
      value: "Legal and Law Enforcement",
      label: "Legal and Law Enforcement",
    },
    {
      value: "Military and Defense",
      label: "Military and Defense",
    },
    {
      value: "Construction and Trades",
      label: "Construction and Trades",
    },
    {
      value: "Science and Research",
      label: "Science and Research",
    },
    {
      value: "Customer Support and Call Centers",
      label: "Customer Support and Call Centers",
    },
    {
      value: "Environmental and Sustainability",
      label: "Environmental and Sustainability",
    },
    {
      value: "Human Resources and Recruitment",
      label: "Human Resources and Recruitment",
    },
    {
      value: "Marketing and Advertising",
      label: "Marketing and Advertising",
    },
    {
      value: "Consulting and Advising",
      label: "Consulting and Advising",
    },
  ];
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Employment History</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={2}>
          <Grid item xs={12}>
            <Autocomplete
              id="degree-field"
              options={classifications}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="job classification"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />
              )}
              onChange={(event, newValue) => {
                handleClassification(newValue.value);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  defaultChecked
                  checked={employmentProfile?.current_job || false}
                  onChange={handleToggleCurrentJob}
                  name="current_job"
                />
              }
              label="current job"
            />
            {employmentProfile?.current_job ? null : (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DatePicker"]}
                  sx={{ width: "100%" }}
                >
                  <DemoItem>
                    <DatePicker
                      name="date_end"
                      label="Date End"
                      value={employmentProfile?.date_end}
                      onChange={handleDateEndChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            )}
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]} sx={{ width: "100%" }}>
                <DemoItem>
                  <DatePicker
                    name="date_hired"
                    label="Date Hired"
                    value={employmentProfile?.date_hired}
                    onChange={handleDateHiredChange}
                    renderInput={(params) => <TextField {...params} required />}
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={
                    employmentProfile?.aligned_with_academic_program || false
                  }
                  onChange={handleToggle}
                  name="aligned_with_academic_program"
                />
              }
              label="Aligned with Academic Program"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="company_name"
              label="company name"
              value={employmentProfile?.company_name}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="job_title"
              label="job title"
              value={employmentProfile?.job_title}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          {[
            {
              label: "gross monthly income",
              name: "gross_monthly_income",
              options: monthlyGrossIncome,
            },
            {
              label: "employment contract",
              name: "employment_contract",
              options: employmentContract,
            },
            {
              label: "job level position",
              name: "job_level_position",
              options: jobLevelPosition,
            },
            {
              label: "type of employer",
              name: "type_of_employer",
              options: employerType,
            },
            {
              label: "location of employment",
              name: "location_of_employment",
              options: locationOfEmployment,
            },
          ].map(({ label, options, name }) => (
            <Grid item xs={12} key={label}>
              <FormControl fullWidth>
                <InputLabel>{label}</InputLabel>
                <Select name={name} onChange={handleChange}>
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}
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

export default AddEmploymentModal;
