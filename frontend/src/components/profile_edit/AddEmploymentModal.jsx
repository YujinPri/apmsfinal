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
import Autocomplete from "@mui/material/Autocomplete";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";

const AddEmploymentModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const cities = queryClient.getQueryData("cities");
  const isLoadingCities = queryClient.isFetching("cities");
  const jobs = queryClient.getQueryData("jobs");
  const isLoadingJobs = queryClient.isFetching("jobs");

  const [employmentProfile, setEmploymentProfile] = useState(null);

  useEffect(() => {
    setEmploymentProfile({
      company_name: "",
      job_title: "",
      job: "",
      date_hired: null,
      current_job: false,
      is_international: false,
      date_end: null,
      classification: "",
      gross_monthly_income: "",
      employment_contract: "",
      city: "",
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEmploymentProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleToggleCurrentJob = (event) => {
    setEmploymentProfile((prevProfile) => ({
      ...prevProfile,
      current_job: event.target.checked,
    }));
  };
  const handleToggleInternational = (event) => {
    setEmploymentProfile((prevProfile) => ({
      ...prevProfile,
      is_international: event.target.checked,
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
    console.log(employmentProfile);
    if (
      employmentProfile.job == "" ||
      employmentProfile.company_name == "" ||
      employmentProfile.date_hired == null ||
      (!employmentProfile.current_job && employmentProfile.date_end == null) ||
      (!employmentProfile.is_international && employmentProfile.city == null) ||
      employmentProfile.gross_monthly_income == "" ||
      employmentProfile.employment_contract == ""
    ) {
      setMessage("please fill out all of the fields.");
      setSeverity("error");
      setOpenSnackbar(true);
      return; // Prevent form submission
    }

    const now = new Date(); // Get the current date
    let date_end = employmentProfile?.date_end || now;

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
      job: employmentProfile?.job,
      date_hired: employmentProfile?.date_hired.format("YYYY-MM-DD"),
      date_end: employmentProfile?.date_end?.format("YYYY-MM-DD"),
      gross_monthly_income: employmentProfile?.gross_monthly_income,
      employment_contract: employmentProfile?.employment_contract,
      city: employmentProfile?.city,
      is_international: employmentProfile?.is_international,
    };

    if (employmentProfile?.current_job) data.date_end = null;
    if (employmentProfile?.is_international) data.city = "";

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

  if (isLoadingJobs || isLoadingCities) {
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

  const jobsOptions = jobs.data;
  const citiesOptions = cities;

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
      <DialogTitle>Add Employment History</DialogTitle>
      <DialogContent sx={{ width: "40vw" }}>
        <Grid container spacing={2} p={2}>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]} sx={{ width: "100%" }}>
                <DemoItem>
                  <DatePicker
                    name="date_hired"
                    label="date hired"
                    value={employmentProfile?.date_hired}
                    onChange={handleDateHiredChange}
                    renderInput={(params) => <TextField {...params} required />}
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid
            container
            item
            xs={12}
            alignItems="center"
            style={{ height: "80px" }}
          >
            {!employmentProfile?.current_job && (
              <Grid item xs={7}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DatePicker"]}
                    sx={{ width: "100%" }}
                  >
                    <DemoItem>
                      <DatePicker
                        name="date_end"
                        label="date end"
                        value={employmentProfile?.date_end}
                        onChange={handleDateEndChange}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
            )}
            <Grid item xs={5}>
              <FormControlLabel
                sx={{ marginLeft: "auto" }}
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
            </Grid>
          </Grid>

          <Grid
            container
            item
            xs={12}
            alignItems="center"
            style={{ height: "80px" }}
          >
            {!employmentProfile?.is_international && (
              <Grid item xs={7}>
                <Autocomplete
                  name="city"
                  options={citiesOptions}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, value) =>
                    option.name === value.name
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="city"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    />
                  )}
                  onChange={(event, value) =>
                    setEmploymentProfile((prevProfile) => ({
                      ...prevProfile,
                      city: value ? value.name : null,
                    }))
                  }
                  value={
                    citiesOptions.find(
                      (option) => option.name === employmentProfile?.city
                    ) || null
                  }
                />
              </Grid>
            )}
            <Grid item xs={5}>
              <FormControlLabel
                sx={{ marginLeft: "auto" }}
                control={
                  <Switch
                    defaultChecked
                    checked={employmentProfile?.is_international || false}
                    onChange={handleToggleInternational}
                    name="is_international"
                  />
                }
                label="work abroad"
              />
            </Grid>
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
            <Autocomplete
              name="job"
              options={jobsOptions}
              getOptionLabel={(option) => option.name}
              getOptionSelected={(option, value) => option.name === value.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="job title"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />
              )}
              onChange={(event, value) =>
                setEmploymentProfile((prevProfile) => ({
                  ...prevProfile,
                  job: value ? value.id : null,
                  job_title: value ? value.name : null,
                }))
              }
              value={
                jobsOptions.find(
                  (option) => option.name === employmentProfile?.job_title
                ) || null
              }
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>gross monthly income</InputLabel>
              <Select name="gross_monthly_income" onChange={handleChange}>
                {monthlyGrossIncome.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>employment contract</InputLabel>
              <Select name="employment_contract" onChange={handleChange}>
                {employmentContract.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.value}
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
    </Dialog>
  );
};

export default AddEmploymentModal;
