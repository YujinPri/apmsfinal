import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import UpdateProfileContent from "./UpdateProfileContent";
import { Box, Breadcrumbs, Link, Tab, Tabs, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import WorkIcon from "@mui/icons-material/Work";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import SchoolIcon from "@mui/icons-material/School";
import UpdateProfileSkeleton from "./UpdateProfileSkeleton";

function UpdateProfile() {
  const [value, setValue] = React.useState(0);
  const axiosPrivate = useAxiosPrivate({
    signal: new AbortController().signal,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const [profile, setProfile] = useState(null);
  const [educ, setEduc] = useState(null);
  const [employment, setEmployment] = useState(null);

  const [profileLoading, setProfileLoading] = useState(true);
  const [educLoading, setEducLoading] = useState(true);
  const [employmentLoading, setEmploymentLoading] = useState(true);

  const getProfileData = async (signal) => {
    try {
      const response = await axiosPrivate.get(
        "/profiles/demographic_profile/me",
        { signal }
      );
      return response.data;
    } catch (err) {
      if (err.response?.data?.detail === "Token has expired") {
        setAuth(); // clears out all the token logs you out in short
        navigate("/login", {
          state: {
            from: location,
            message:
              "You have been logged out automatically for security purposes. Please login again.",
          },
          replace: true,
        });
      } else {
        console.error(err);
        if (err.profile_response.data.detail == "Token has expired")
          setAuth({}); //clears out all the token logs you out in short
        navigate("/login", {
          state: {
            from: location,
            message:
              "you have been logout automatically for security purposes, please login again",
          },
          replace: true,
        });
      }
    }
  };

  const getEducData = async (signal) => {
    try {
      const response = await axiosPrivate.get(
        "/profiles/educational_profile/me",
        { signal }
      );
      return response.data;
    } catch (err) {
      console.error(err);
      if (err.profile_response.data.detail == "Token has expired") setAuth({}); //clears out all the token logs you out in short
      navigate("/login", {
        state: {
          from: location,
          message:
            "you have been logout automatically for security purposes, please login again",
        },
        replace: true,
      });
    }
  };

  const getEmploymentData = async (signal) => {
    try {
      const response = await axiosPrivate.get(
        "/profiles/employment_profiles/me?page=1&per_page=50",
        { signal }
      );
      return response.data;
    } catch (err) {
      console.error(err);
      if (err.profile_response.data.detail == "Token has expired") setAuth({}); //clears out all the token logs you out in short
      navigate("/login", {
        state: {
          from: location,
          message:
            "you have been logout automatically for security purposes, please login again",
        },
        replace: true,
      });
    }
  };

  const reloadProfileData = async () => {
    const controller = new AbortController();
    console.log(profileLoading + "nani");
    setProfileLoading(true);
    console.log(profileLoading + "nani");
    const profileData = await getProfileData(controller.signal);

    if (profileData) {
      setProfile(profileData);
    }
    setProfileLoading(false);
    console.log(profileLoading + "nani");
  };

  const reloadEducData = async () => {
    const controller = new AbortController();
    setProfileLoading(true);
    const educData = await getEducData(controller.signal);

    if (educData) {
      setEduc(educData);
    }
    setProfileLoading(false);
  };

  const reloadEmploymentData = async () => {
    const controller = new AbortController();
    setProfileLoading(true);
    const employmentData = await getEmploymentData(controller.signal);

    if (employmentData) {
      setEmployment(employmentData);
    }
    setProfileLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const initiateProfiles = async () => {
      const [profileData, educData, employmentData] = await Promise.allSettled([
        getProfileData(controller.signal),
        getEducData(controller.signal),
        getEmploymentData(controller.signal),
      ]);

      if (isMounted) {
        if (profileData.status === "fulfilled") {
          setProfile(profileData.value);
          setProfileLoading(false)
        }
        if (educData.status === "fulfilled") {
          setEduc(educData.value);
          setEducLoading(false)
        }
        if (employmentData.status === "fulfilled") {
          setEmployment(employmentData.value);
          setEmploymentLoading(false)
        }
      }
    };

    initiateProfiles();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      const targetOffset = element.offsetTop - 165; // Fixed offset of -63
      window.scrollTo({
        top: targetOffset,
        behavior: "smooth",
      });
    }
  }

  return (
    <Box
      flex={4}
      p={{ xs: 0, md: 2 }}
      sx={{
        backgroundColor: (theme) => theme.palette.secondary.main,
        display: "flex",
        gap: 2,
        flexDirection: "column",
      }}
    >
      <Breadcrumbs separator="-" aria-label="breadcrumb">
        <RouterLink
          to="/home"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography variant="subtitle1" fontWeight={800}>
            home
          </Typography>
        </RouterLink>
        <Link
          underline="hover"
          color="text.primary"
          href="#"
          aria-current="page"
        >
          <Typography variant="subtitle1" fontWeight={800}>
            profile
          </Typography>
        </Link>
      </Breadcrumbs>
      <Box
        position="sticky"
        top={63}
        zIndex={1000}
        bgcolor="inherit"
        borderBottom="1px solid rgba(0, 0, 0, 0.12)"
        sx={{ backgroundColor: (theme) => theme.palette.common.main }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          aria-label="icon tabs example"
        >
          <Tab
            icon={<PersonPinIcon />}
            label="profile"
            onClick={() => scrollToSection("prof")}
          />
          <Tab
            icon={<SchoolIcon />}
            label="educ background"
            onClick={() => scrollToSection("educbg")}
          />
          <Tab
            icon={<WorkIcon />}
            label="employment"
            onClick={() => scrollToSection("emphis")}
          />
        </Tabs>
      </Box>

      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.common.main,
          padding: 2,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h1"
          fontWeight={800}
          sx={{
            padding: "10px",
            borderBottom: "2px solid",
            color: "primary",
          }}
          id="prof"
        >
          profile
        </Typography>
        {profileLoading ? (
          <UpdateProfileSkeleton section={1} />
        ) : (
          <UpdateProfileContent
            section={1}
            profile={profile}
            updateContent={reloadProfileData}
          />
        )}
      </Box>
      {!educ ||
      educ.achievements_story ||
      educ.civil_service_eligibility ||
      educ.degree ||
      educ.field ||
      educ.honors_and_awards ||
      educ.post_grad_act ||
      educ.student_number ||
      educ.year_graduated ? (
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            padding: 2,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h1"
            fontWeight={800}
            // color="secondary"
            sx={{
              padding: "10px",
              borderBottom: "2px solid",
              marginBottom: "10px",
              color: "primary",
            }}
            id="educbg"
          >
            pupqc educational background
          </Typography>
          {educLoading ? (
            <UpdateProfileSkeleton section={2} />
          ) : (
            <UpdateProfileContent section={2} profile={educ} updateContent />
          )}
        </Box>
      ) : null}

      {!employment ||
      !(
        !employment?.present_employment_status &&
        employment?.employments?.length == 0
      ) ? (
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            padding: 2,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h1"
            fontWeight={800}
            sx={{
              padding: "10px",
              borderBottom: "2px solid",
              marginBottom: "10px",
              color: "primary",
            }}
            id="emphis"
          >
            employment history
          </Typography>
          {employmentLoading ? (
            <UpdateProfileSkeleton section={3} />
          ) : (
            <UpdateProfileContent section={3} profile={employment} />
          )}
        </Box>
      ) : null}
      {console.log(
        !employment?.present_employment_status &&
          employment?.employments?.length == 0
      )}
    </Box>
  );
}

export default UpdateProfile;
