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
  OutlinedInput,
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
  Add,
} from "@mui/icons-material";

import Autocomplete from "@mui/material/Autocomplete";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import useGetEmploymentSpecific from "../../hooks/useGetEmploymentSpecific";
import useJobs from "../../hooks/useJobs";
import useRegions from "../../hooks/useRegion";
import useCitiesMunicipalities from "../../hooks/useCitiesMunicipalities";
import useCountries from "../../hooks/useCountries";
import AddJob from "../selections/AddJobModal";

const EditEmploymentModal = ({ open, onClose, employmentID }) => {
  const queryClient = useQueryClient();
  const [employmentProfile, setEmploymentProfile] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const { data: jobs, isLoading: isLoadingJobs } = useJobs();
  const { data: regions, isLoading: isLoadingRegions } = useRegions();
  const { data: countries, isLoading: isLoadingCountries } = useCountries();
  const {
    data: citiesMunicipalities,
    isLoading: isLoadingCitiesMunicipalities,
  } = useCitiesMunicipalities(employmentProfile?.region_code);
  const { data: cachedData, isLoading: isLoadingProfile } =
    useGetEmploymentSpecific(employmentID);

  useEffect(() => {
    if (cachedData) {
      setEmploymentProfile({
        company_name: cachedData?.data?.company_name || "",
        job: cachedData?.data?.job || "",
        job_title: cachedData?.data?.job_title || "",
        date_hired: dayjs(cachedData?.data.date_hired) || null,
        date_end: dayjs(cachedData?.data.date_end) || null,
        current_job: !cachedData?.data?.date_end,

        is_international: cachedData?.data?.is_international || false,
        country_code: cachedData?.data?.country_code || "",
        country: cachedData?.data?.country || "",
        region_code: cachedData?.data?.region_code || "",
        region: cachedData?.data?.region || "",
        city: cachedData?.data?.city || "",
        city_code: cachedData?.data?.city_code || "",

        gross_monthly_income: cachedData?.data?.gross_monthly_income || "",
        employment_contract: cachedData?.data?.employment_contract || "",
        job_position: cachedData?.data?.job_position || "",
        employer_type: cachedData?.data?.employer_type || "",
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
        `/profiles/employment_profiles/${employmentID}`,
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
        queryClient.invalidateQueries(
          "employment-profile-specific",
          employmentID
        );
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
    console.log("employmentProfile:", employmentProfile);

    if (
      employmentProfile.job == "" ||
      employmentProfile.company_name == "" ||
      employmentProfile.date_hired == null ||
      (!employmentProfile.current_job && employmentProfile.date_end == null) ||
      (!employmentProfile.is_international &&
        employmentProfile.city == null &&
        employmentProfile.region == null) ||
      (employmentProfile.is_international &&
        employmentProfile.country == null) ||
      employmentProfile.gross_monthly_income == "" ||
      employmentProfile.employment_contract == "" ||
      employmentProfile.job_position == "" ||
      employmentProfile.employer_type == ""
    ) {
      setMessage("please fill out all of the fields.");
      setSeverity("error");
      setOpenSnackbar(true);
      return; // Prevent form submission
    }

    const now = new Date(); // Get the current date

    if (
      employmentProfile?.date_end <= employmentProfile?.date_hired ||
      employmentProfile?.date_end > now ||
      employmentProfile?.date_hired > now
    ) {
      setMessage("invalid date range.");
      setSeverity("error");
      setOpenSnackbar(true);
      return; // Prevent form submission
    }

    const data = {
      job: employmentProfile?.job,
      company_name: employmentProfile?.company_name,
      date_hired: employmentProfile?.date_hired.format("YYYY-MM-DD"),
      date_end: employmentProfile?.date_end?.format("YYYY-MM-DD"),
      gross_monthly_income: employmentProfile?.gross_monthly_income,
      employment_contract: employmentProfile?.employment_contract,
      job_position: employmentProfile?.job_position,
      employer_type: employmentProfile?.employer_type,
      is_international: employmentProfile?.is_international,
      address: employmentProfile?.address,
      country: employmentProfile?.country,
      region: employmentProfile?.region,
      region_code: employmentProfile?.region_code,
      city: employmentProfile?.city,
      city_code: employmentProfile?.city_code,
    };

    if (employmentProfile?.current_job) data.date_end = null;
    if (employmentProfile?.is_international) data.city = "";

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

  const jobPosition = [
    {
      value: "Chairperson / Board of Directors",
    },
    {
      value: "Chief Executive Offices & C-Suite",
    },
    {
      value: "Vice President",
    },
    {
      value: "Director",
    },
    {
      value: "Manager",
    },
    {
      value: "Individual Contributor",
    },
    {
      value: "Entry Level",
    },
  ];

  const employerType = [
    {
      value: "Public / Government",
    },
    {
      value: "Private Sector",
    },
    {
      value: "Non-profit / Third sector",
    },
    {
      value: "Self-Employed / Independent",
    },
  ];

  if (
    isLoadingJobs ||
    isLoadingRegions ||
    isLoadingProfile ||
    isLoadingCountries
  ) {
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

  return (
    <>
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
        <DialogTitle>Edit Employment History</DialogTitle>
        <DialogContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant="h6" my={2}>
                Job Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="company_name"
                    label="Company Name"
                    value={employmentProfile?.company_name}
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "stretch",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Autocomplete
                      sx={{ width: "80%" }}
                      name="job"
                      options={jobs?.data}
                      getOptionLabel={(option) => option.name}
                      getOptionSelected={(option, value) =>
                        option.name === value.name
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Job Title" />
                      )}
                      onChange={(event, value) =>
                        setEmploymentProfile((prevProfile) => ({
                          ...prevProfile,
                          job: value ? value.id : null,
                          job_title: value ? value.name : null,
                        }))
                      }
                      value={
                        jobs?.data?.find(
                          (option) =>
                            option.name === employmentProfile?.job_title
                        ) || null
                      }
                    />
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setOpenModal(true)}
                    >
                      Job
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" my={2}>
                Job Length
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={
                      <Switch
                        defaultChecked
                        checked={employmentProfile?.current_job || false}
                        onChange={() => {
                          setEmploymentProfile((prevProfile) => ({
                            ...prevProfile,
                            current_job: event.target.checked,
                          }));
                        }}
                        name="current_job"
                      />
                    }
                    label="current job"
                  />
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DemoItem>
                        <DatePicker
                          name="date_hired"
                          label="Date Hired"
                          value={employmentProfile?.date_hired}
                          onChange={handleDateHiredChange}
                          renderInput={(params) => (
                            <TextField {...params} required />
                          )}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid
                  item
                  xs={6}
                  style={{
                    display: employmentProfile?.current_job ? "none" : "block",
                  }}
                >
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
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" my={2}>
                Job Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={
                      <Switch
                        defaultChecked
                        checked={employmentProfile?.is_international || false}
                        onChange={(event) => {
                          setEmploymentProfile((prevProfile) => ({
                            ...prevProfile,
                            is_international: event.target.checked,
                          }));
                        }}
                        name="is_international"
                      />
                    }
                    label="working internationally"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: !employmentProfile?.is_international
                      ? "none"
                      : "block",
                  }}
                >
                  <Autocomplete
                    fullWidth
                    name="country"
                    options={countries}
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) =>
                      option.name === value.name
                    }
                    getOptionDisabled={(option) => option.name == "Philippines"}
                    renderInput={(params) => (
                      <TextField {...params} label="country" />
                    )}
                    onChange={(event, value) => {
                      setEmploymentProfile((prevProfile) => ({
                        ...prevProfile,
                        country: value ? value.name : null,
                      }));
                    }}
                    value={
                      countries.find(
                        (option) => option.name === employmentProfile?.country
                      ) || null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: employmentProfile?.is_international
                      ? "none"
                      : "block",
                  }}
                >
                  <Autocomplete
                    fullWidth
                    name="region"
                    options={regions}
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) =>
                      option.name === value.name
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Region" />
                    )}
                    onChange={(event, value) => {
                      setEmploymentProfile((prevProfile) => ({
                        ...prevProfile,
                        region: value ? value.name : null,
                        address: value ? value.name : null,
                        city: null,
                        region_code: value ? value.code : null,
                        city_code: null,
                      }));
                    }}
                    value={
                      regions.find(
                        (option) => option.name === employmentProfile?.region
                      ) || null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: employmentProfile?.is_international
                      ? "none"
                      : "block",
                  }}
                >
                  <Autocomplete
                    fullWidth
                    name="city"
                    disabled={
                      !citiesMunicipalities || isLoadingCitiesMunicipalities
                    }
                    options={citiesMunicipalities || []}
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) =>
                      option.name === value.name
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="City or Municipality" />
                    )}
                    onChange={(event, value) => {
                      setEmploymentProfile((prevProfile) => ({
                        ...prevProfile,
                        city: value ? value.name : null,
                        address: value
                          ? prevProfile?.region + ", " + value.name
                          : prevProfile?.region,
                        city_code: value ? value.code : null,
                      }));
                    }}
                    value={
                      citiesMunicipalities?.find(
                        (option) => option.name === employmentProfile?.city
                      ) || null
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" my={2}>
                Job Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Gross Monthly Income</InputLabel>
                    <Select
                      name="gross_monthly_income"
                      onChange={handleChange}
                      value={employmentProfile?.gross_monthly_income || ""}
                      input={<OutlinedInput label="Gross Monthly Income" />}
                    >
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
                    <InputLabel>Employment Contract</InputLabel>
                    <Select
                      name="employment_contract"
                      onChange={handleChange}
                      value={employmentProfile?.employment_contract || ""}
                      input={<OutlinedInput label="Employment Contract" />}
                    >
                      {employmentContract.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Job Position</InputLabel>
                    <Select
                      name="job_position"
                      onChange={handleChange}
                      value={employmentProfile?.job_position || ""}
                      input={<OutlinedInput label="Job Position" />}
                    >
                      {jobPosition.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Employer Type</InputLabel>
                    <Select
                      name="employer_type"
                      value={employmentProfile?.employer_type || ""}
                      onChange={handleChange}
                      input={<OutlinedInput label="Employer Type" />}
                    >
                      {employerType.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
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
      {openModal && (
        <AddJob open={openModal} onClose={() => setOpenModal(false)} />
      )}
    </>
  );
};

export default EditEmploymentModal;
