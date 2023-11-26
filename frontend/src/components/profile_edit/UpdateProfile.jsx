import React, { useState } from "react";
import useGetDemographicProfile from "../../hooks/useGetDemographicProfile";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  Box,
  Breadcrumbs,
  Fab,
  Link,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import SchoolIcon from "@mui/icons-material/School";
import DemographicProfile from "../profile_display/DemographicProfile";
import CareerProfile from "../profile_display/CareerProfile";
import EditableEmploymentProfile from "../profile_edit/EditableEmploymentProfile";
import { Add, AddCircleRounded, Edit } from "@mui/icons-material";
import ProfileEditModal from "./ProfileEditModal";
import EducProfileEditModal from "./CareerEditModal";
import AddEmploymentModal from "./AddEmploymentModal";
import AddAchievementModal from "./AddAchievementModal";
import useGetCareerProfile from "../../hooks/useGetCareerProfile";
import AddEducationModal from "./AddEducationModal";

function UpdateProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [value, setValue] = React.useState(0);
  const [modalOpen, setModalOpen] = useState({
    profile: false,
    career: false,
    employment: false,
    add_achievement: false,
    add_achievement: false,
    add_education: false,
  });

  const {
    data: demographicData,
    isLoading: isLoadingDemographicData,
    isError: isErrorDemographicData,
    error: errorDemographicData,
  } = useGetDemographicProfile();

  const {
    data: careerData,
    isLoading: isLoadingCareerData,
    isError: isErrorCareerData,
    error: errorCareerData,
  } = useGetCareerProfile();

  if (isErrorDemographicData || isErrorCareerData) {
    const expiredCareerData =
      errorCareerData.response.data.detail === "Token has expired";
    const expiredDemographicData =
      errorDemographicData.response.data.detail === "Token has expired";
    if (expiredDemographicData || expiredCareerData) {
      setAuth({}); // Clears out all the token, logs you out
      navigate("/login", {
        state: {
          from: location,
          message:
            "You have been logged out for security purposes, please login again",
        },
        replace: true,
      });
    }
  }

  const handleModalOpen = (type) => {
    setModalOpen((prevState) => ({
      ...prevState,
      [type]: true,
    }));
  };

  const handleCloseModal = () => {
    setModalOpen((prevState) => ({
      ...prevState,
      profile: false,
      career: false,
      employment: false,
      add_achievement: false,
      add_education: false,
    }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const targetOffset = element.offsetTop - 165; 
      window.scrollTo({
        top: targetOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box
      flex={4}
      p={{ sm: 4, md: 2 }}
      sx={{
        backgroundColor: (theme) => theme.palette.secondary.main,
        display: "flex",
        gap: 2,
        flexDirection: "column",
      }}
    >
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
            onClick={() => scrollToSection("profile_background")}
          />
          <Tab
            icon={<SchoolIcon />}
            label="career background"
            onClick={() => scrollToSection("career_background")}
          />
          <Tab
            icon={<WorkIcon />}
            label="employment"
            onClick={() => scrollToSection("employment_history")}
          />
        </Tabs>
      </Box>

      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.common.main,
          padding: 2,
          borderRadius: 3,
          position: "relative",
        }}
        id="profile_background"
      >
        <Typography
          variant="h1"
          fontWeight={800}
          sx={{
            padding: "10px",
            borderBottom: "2px solid",
            color: "primary",
          }}
        >
          profile
        </Typography>
        <Tooltip title="update demographic profile">
          <Fab
            size="small"
            color="primary"
            sx={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
            }}
            onClick={() => handleModalOpen("profile")}
          >
            <Edit />
          </Fab>
        </Tooltip>
        <DemographicProfile
          data={demographicData}
          isLoading={isLoadingDemographicData}
        />
      </Box>

      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.common.main,
          padding: 2,
          borderRadius: 3,
          position: "relative",
        }}
        id="career_background"
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
        >
          pupqc career background
        </Typography>
        <Box
          sx={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            display: "flex",
            gap: "0.5rem",
          }}
        >
          <Tooltip title="add achievement">
            <Fab
              size="small"
              onClick={() => handleModalOpen("add_achievement")}
              color="primary"
            >
              <Add />
            </Fab>
          </Tooltip>
          <Tooltip title="add education">
            <Fab
              size="small"
              onClick={() => handleModalOpen("add_education")}
              color="primary"
            >
              <Add />
            </Fab>
          </Tooltip>
          <Tooltip title="edit career profile">
            <Fab
              size="small"
              color="primary"
              onClick={() => handleModalOpen("career")}
            >
              <Edit />
            </Fab>
          </Tooltip>
        </Box>
        <CareerProfile data={careerData} isLoading={isLoadingCareerData} />
      </Box>

      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.common.main,
          padding: 2,
          borderRadius: 3,
          position: "relative",
        }}
        id="employment_history"
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
        >
          employment history
        </Typography>
        <Tooltip title="add employment">
          <Fab
            size="small"
            color="primary"
            sx={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
            }}
            onClick={() => handleModalOpen("employment")} // Trigger the profile edit modal
          >
            <Add />
          </Fab>
        </Tooltip>
        <EditableEmploymentProfile />
      </Box>
      {modalOpen.profile && (
        <ProfileEditModal open={modalOpen.profile} onClose={handleCloseModal} />
      )}
      {modalOpen.career && (
        <EducProfileEditModal
          open={modalOpen.career}
          onClose={handleCloseModal}
        />
      )}
      {modalOpen.employment && (
        <AddEmploymentModal
          open={modalOpen.employment}
          onClose={handleCloseModal}
        />
      )}
      {modalOpen.add_achievement && (
        <AddAchievementModal
          open={modalOpen.add_achievement}
          onClose={handleCloseModal}
        />
      )}
      {modalOpen.add_education && (
        <AddEducationModal
          open={modalOpen.add_education}
          onClose={handleCloseModal}
        />
      )}
    </Box>
  );
}

export default UpdateProfile;
