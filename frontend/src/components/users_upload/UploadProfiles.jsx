import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Fab,
  Grid,
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
  CloudUpload,
  Edit,
  FilterList,
  Label,
  MenuBook,
  PersonPin,
  School,
  Work,
} from "@mui/icons-material";
import ClassificationsRow from "../selections/ClassificationsRow";
import CoursesRow from "../selections/CoursesRow";
import JobsRow from "../selections/JobsRow";
import AddClassification from "../selections/AddClassificationModal";
import AddCourse from "../selections/AddCourseModal";
import AddJob from "../selections/AddJobModal";
import DemoProfileDataGrid from "./DemoProfileDataGrid";
import ProfilesUploadInput from "./ProfilesUploadInput";

export const UploadProfiles = () => {
  const [value, setValue] = useState(0);
  const [activeTab, setActiveTab] = useState("manage_classifications");
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
              label="User Accounts"
              onClick={() => setActiveTab("manage_classifications")}
            />
            <Tab
              icon={<MenuBook />}
              label="courses"
              onClick={() => setActiveTab("manage_courses")}
            />
            <Tab
              icon={<Business />}
              label="jobs"
              onClick={() => setActiveTab("manage_jobs")}
            />
          </Tabs>
        </Box>

        {activeTab === "manage_classifications" && (
          <Grid
            container
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              padding: 2,
              borderRadius: 3,
              position: "relative",
              opacity: activeTab === "manage_classifications" ? 1 : 0,
              display: activeTab === "manage_classifications" ? "flex" : "none",
              gap: 2,
              transition: "opacity 0.5s ease-in-out",
            }}
            id="manage_classifications"
          >
            <Grid item xs={12}>
              <Typography
                variant="h1"
                fontWeight={800}
                sx={{
                  padding: "10px",
                  borderBottom: "2px solid",
                  color: "primary",
                }}
              >
                Upload User Accounts
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ProfilesUploadInput />
            </Grid>
            <Grid item xs={12}>
              <DemoProfileDataGrid />
            </Grid>
          </Grid>
        )}
        {activeTab === "manage_courses" && (
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              padding: 2,
              borderRadius: 3,
              position: "relative",
              opacity: activeTab === "manage_courses" ? 1 : 0,
              display: activeTab === "manage_courses" ? "block" : "none",
              transition: "opacity 0.5s ease-in-out",
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
        )}
        {activeTab === "manage_jobs" && (
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              padding: 2,
              borderRadius: 3,
              position: "relative",
              opacity: activeTab === "manage_jobs" ? 1 : 0,
              display: activeTab === "manage_jobs" ? "block" : "none",
              transition: "opacity 0.5s ease-in-out",
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
        )}
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
