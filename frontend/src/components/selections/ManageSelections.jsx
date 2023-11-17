import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Fab,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
  Business,
  Edit,
  FilterList,
  Label,
  MenuBook,
  PersonPin,
  School,
  Work,
} from "@mui/icons-material";
import ClassificationsRow from "./ClassificationsRow";
import AddClassification from "./AddClassificationModal";

export const ManageSelections = () => {
  const [value, setValue] = useState(0);
  const [modalOpen, setModalOpen] = useState({
    classification: false,
    job: false,
    course: false,
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
      classification: false,
      job: false,
      course: false,
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
    <Box>
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
              manage selections
            </Typography>
          </Link>
        </Breadcrumbs>
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            borderRadius: 3,
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
                icon={<Label />}
                label="classifications"
                onClick={() => scrollToSection("manage_classifications")}
              />
              <Tab
                icon={<MenuBook />}
                label="courses"
                onClick={() => scrollToSection("manage_courses")}
              />
              <Tab
                icon={<Business />}
                label="jobs"
                onClick={() => scrollToSection("manage_jobs")}
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
            id="manage_classifications"
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
              manage classifications
            </Typography>
            <Tooltip title="add classifications">
              <Fab
                size="small"
                color="primary"
                sx={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                }}
                onClick={() => handleModalOpen("classification")}
              >
                <Edit />
              </Fab>
            </Tooltip>
            <Box p={4}>
              <Paper>
                <ClassificationsRow />
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
      {modalOpen.classification && (
        <AddClassification
          open={modalOpen.classification}
          onClose={handleCloseModal}
        />
      )}
      {/* {modalOpen.career && (
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
      )} */}
    </Box>
  );
};
