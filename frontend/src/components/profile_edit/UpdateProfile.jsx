import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import {
  Box,
  Breadcrumbs,
  Fab,
  Link,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import SchoolIcon from "@mui/icons-material/School";
import DemographicProfile from "../profile_display/DemographicProfile";
import EducationalProfile from "../profile_display/CareerProfile";
import EditableEmploymentProfile from "../profile_edit/EditableEmploymentProfile";
import { AddCircleRounded, Edit } from "@mui/icons-material";
import ProfileEditModal from "./ProfileEditModal";
import EducProfileEditModal from "./CareerEditModal";
import AddEmploymentModal from "./AddEmploymentModal";
import axios from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function UpdateProfile() {
  const axiosPrivate = useAxiosPrivate();

  const getCities = async () => {
    try {
      const response = await axios.get("https://psgc.gitlab.io/api/cities/", {
        headers: {
          accept: "text/html",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching cities:", error);
      throw error;
    }
  };

  const getJobs = async () => {
    return await axiosPrivate.get("/selections/jobs/");
  };

  useQuery("jobs", getJobs);
  useQuery("cities", getCities);

  const [value, setValue] = React.useState(0);
  const [modalOpen, setModalOpen] = useState({
    profile: false,
    career: false,
    employment: false,
  });

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
    }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const targetOffset = element.offsetTop - 165; // Fixed offset of -63
      window.scrollTo({
        top: targetOffset,
        behavior: "smooth",
      });
    }
  };
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
        <DemographicProfile />
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
        <Fab
          size="small"
          color="primary"
          sx={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
          }}
          onClick={() => handleModalOpen("career")}
        >
          <Edit />
        </Fab>
        <EducationalProfile />
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
          <AddCircleRounded />
        </Fab>
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
    </Box>
  );
}

export default UpdateProfile;
