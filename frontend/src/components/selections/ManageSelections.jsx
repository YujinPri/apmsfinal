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
  Add,
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
import CoursesRow from "./CoursesRow";
import JobsRow from "./JobsRow";
import AddClassification from "./AddClassificationModal";
import AddCourse from "./AddCourseModal";
import AddJob from "./AddJobModal";

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
              <Add />
            </Fab>
          </Tooltip>
          <Box p={4}>
            <Paper>
              <ClassificationsRow />
            </Paper>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            padding: 2,
            borderRadius: 3,
            position: "relative",
          }}
          id="manage_courses"
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
            manage courses
          </Typography>
          <Tooltip title="add courses">
            <Fab
              size="small"
              color="primary"
              sx={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
              }}
              onClick={() => handleModalOpen("course")}
            >
              <Add />
            </Fab>
          </Tooltip>
          <Box p={4}>
            <Paper>
              <CoursesRow />
            </Paper>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            padding: 2,
            borderRadius: 3,
            position: "relative",
          }}
          id="manage_jobs"
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
            manage jobs
          </Typography>
          <Tooltip title="add jobs">
            <Fab
              size="small"
              color="primary"
              sx={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
              }}
              onClick={() => handleModalOpen("job")}
            >
              <Add />
            </Fab>
          </Tooltip>
          <Box p={4}>
            <Paper>
              <JobsRow />
            </Paper>
          </Box>
        </Box>
      </Box>
      {modalOpen.classification && (
        <AddClassification
          open={modalOpen.classification}
          onClose={handleCloseModal}
        />
      )}
      {modalOpen.course && (
        <AddCourse open={modalOpen.course} onClose={handleCloseModal} />
      )}
      {modalOpen.job && (
        <AddJob open={modalOpen.job} onClose={handleCloseModal} />
      )}
    </Box>
  );
};
