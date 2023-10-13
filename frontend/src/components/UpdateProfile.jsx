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
  const axiosPrivate = useAxiosPrivate();
  const [profile, setProfile] = useState();
  const [educ, setEduc] = useState();
  const [employment, setEmployment] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    profilepicture: "",
    password: "",
    confirmationPassword: "",
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const initiateProfiles = async () => {
      try {
        const profile_response = await axiosPrivate.get(
          "/profiles/demographic_profile/me",
          {
            signal: controller.signal,
          }
        );

        const educ_response = await axiosPrivate.get(
          "/profiles/educational_profile/me",
          {
            signal: controller.signal,
          }
        );

        const employment_response = await axiosPrivate.get(
          "/profiles/employment_profiles/me?page=1&per_page=50",
          {
            signal: controller.signal,
          }
        );

        isMounted &&
          (setProfile(profile_response.data),
          setEduc(educ_response.data),
          setEmployment(employment_response.data));
      } catch (err) {
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
    };

    initiateProfiles();
    
    
    return () => {
      isMounted = false;
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
        {!profile ? (
          <UpdateProfileSkeleton section={1} />
        ) : (
          <UpdateProfileContent section={1} profile={profile} />
        )}
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
        {!educ ? (
          <UpdateProfileSkeleton section={2} />
        ) : (
          <UpdateProfileContent section={2} profile={educ} />
        )}
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
            marginBottom: "10px",
            color: "primary",
          }}
          id="emphis"
        >
          employment history
        </Typography>
        {!employment ? (
          <UpdateProfileSkeleton section={3} />
        ) : (
          <UpdateProfileContent section={3} profile={employment} />
        )}
      </Box>
    </Box>
  );
}

export default UpdateProfile;
