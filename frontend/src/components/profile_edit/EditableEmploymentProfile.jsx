import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Fab,
  Grid,
  ListItemIcon,
  Menu,
  MenuItem,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add,
  ArrowBack,
  AddCircleRounded,
  Business,
  BusinessRounded,
  Cake,
  CheckCircle,
  CheckCircleSharp,
  Delete,
  DeleteForever,
  Description,
  Edit,
  Email,
  EmojiEvents,
  Fingerprint,
  GradeRounded,
  LocationCity,
  LocationOn,
  MoreHoriz,
  Phone,
  PublicRounded,
  School,
  Work,
  WorkOutline,
  WorkOutlined,
} from "@mui/icons-material";
import AddEmploymentModal from "./AddEmploymentModal";
import EditEmploymentModal from "./EditEmploymentModal";
import DeleteEmploymentModal from "./DeleteEmploymentModal";
import EmploymentProfile from "../profile_display/EmploymentProfile";

export const EditableEmploymentProfile = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const { auth, setAuth } = useAuth();
  const [isModalOpen, setModalOpen] = useState({
    addModal: false,
    editModal: false,
    deleteModal: false,
  });

  const [employmentID, setEmploymentID] = useState(null);

  const handleModalOpen = (type, id) => {
    setEmploymentID(id);
    setModalOpen((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type) => {
    setModalOpen((prev) => ({ ...prev, [type]: false }));
    setEmploymentID("");
  };

  const Chiptip = ({ icon, label, additional = "", actual = "" }) => (
    <Tooltip
      color="secondary"
      title={actual !== "" ? actual : additional + label}
      sx={{ padding: "0.5rem" }}
    >
      <Chip icon={icon} label={label} />
    </Tooltip>
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getData = async () => {
    return await axiosPrivate.get(
      "/profiles/employment_profiles/me?page=1&per_page=50"
    );
  };

  const { isLoading, data, isError, error, isFetching } = useQuery(
    "employment-profile",
    getData,
    {
      staleTime: 300000,
      // refetchOnWindowFocus: true,
    }
  );

  if (isError) {
    if (error?.response?.data?.detail === "Token has expired") {
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

  if (isLoading) {
    return (
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          justifyContent: "center",
          position: "relative",
          marginY: "2rem",
        }}
      >
        <Box sx={{ alignSelf: "baseline" }}>
          <Skeleton variant="rect" width={200} height={40} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "stretch",
            gap: 2,
            flexDirection: "column",
            width: "80%",
          }}
        >
          {[1, 2, 3].map((index) => (
            <Card sx={{ width: "100%" }} key={index}>
              <CardContent
                sx={{
                  position: "relative",
                }}
              >
                <Grid
                  container
                  alignItems="center"
                  sx={{ display: "flex", flexWrap: "wrap" }}
                >
                  <Grid
                    item
                    sx={{
                      padding: "0 1rem",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Skeleton variant="text" width={200} />
                  </Grid>
                  <Grid item sx={{ whiteSpace: "nowrap" }}>
                    <Skeleton variant="text" width={100} />
                  </Grid>
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  sx={{ display: "flex", flexWrap: "wrap" }}
                >
                  <Grid
                    item
                    sx={{
                      padding: "0 1.5rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Skeleton variant="text" width={150} />
                  </Grid>
                </Grid>
                <Skeleton variant="text" width={250} />
                <Box sx={{ display: "flex", gap: 1, paddingY: 2 }}>
                  <Skeleton variant="rect" width={50} height={20} />
                  <Skeleton variant="rect" width={50} height={20} />
                </Box>
                <Skeleton variant="text" width={150} />
                <Skeleton variant="text" width={150} />
                <Skeleton variant="text" width={150} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Grid>
    );
  }

  data?.data?.employments?.sort((a, b) => {
    const dateA = new Date(a.date_end);
    const dateB = new Date(b.date_end);

    if (dateA > dateB) return -1; // Sort in descending order
    else if (dateA < dateB) return 1;

    return 0;
  });

  return (
    data?.data?.employments && (
      <Grid
        item
        sx={{
          backgroundColor: (theme) => theme.palette.common.main,
          padding: "1rem",
          position: "relative",
        }}
        id="employment_history"
      >
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{
            padding: "10px",
            borderBottom: "2px solid",
            marginBottom: "10px",
            color: "primary",
          }}
        >
          Experience
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
          <Tooltip title="go back">
            <Fab
              size="small"
              onClick={() => navigate(from, { replace: true })}
              color="primary"
            >
              <ArrowBack />
            </Fab>
          </Tooltip>
          <Tooltip title="add employment">
            <Fab
              size="small"
              color="primary"
              onClick={() => handleModalOpen("addModal")} // Trigger the profile edit modal
            >
              <Add />
            </Fab>
          </Tooltip>
        </Box>
        <Grid
          container
          sx={{
            marginY: "1rem",
            gap: 3,
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              paddingX: "1rem",
              flexDirection: "column",
            }}
          >
            {data?.data?.employments.map((employment, index) => {
              return (
                <React.Fragment key={employment.id}>
                  <Grid
                    container
                    sx={{
                      gap: 2,
                      borderBottom: "2px #aaa solid",
                      paddingY: "0.5rem",
                      position: "relative",
                    }}
                  >
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <React.Fragment>
                          <Button
                            {...bindTrigger(popupState)}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: "1rem",
                              right: "1rem",
                            }}
                          >
                            <MoreHoriz color="primary" />
                          </Button>
                          <Menu {...bindMenu(popupState)}>
                            <MenuItem
                              onClick={() =>
                                handleModalOpen("editModal", employment.id)
                              } // Trigger the profile edit modal
                            >
                              <ListItemIcon>
                                <Edit fontSize="small" />
                              </ListItemIcon>
                              edit
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleModalOpen("deleteModal", employment.id)
                              }
                            >
                              <ListItemIcon>
                                <Delete fontSize="small" />
                              </ListItemIcon>
                              delete
                            </MenuItem>
                          </Menu>
                        </React.Fragment>
                      )}
                    </PopupState>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                        }}
                      >
                        {employment.company_name}
                      </Typography>
                      <Chiptip
                        label={(() => {
                          const startDate = new Date(employment.date_hired);
                          if (!employment.date_end)
                            return (
                              "active job since " + startDate.getFullYear()
                            );
                          const endDate = employment.date_end
                            ? new Date(employment.date_end)
                            : "ongoing";
                          const monthsDifference =
                            (endDate.getFullYear() - startDate.getFullYear()) *
                              12 +
                            (endDate.getMonth() - startDate.getMonth());

                          const yearsDifference = monthsDifference / 12; // Calculate years with decimal
                          const formattedYears = yearsDifference.toFixed(1); // Round to 2 decimal places
                          const timespan =
                            monthsDifference < 1
                              ? ""
                              : ` (${formattedYears} years)`;

                          return `${startDate.getFullYear()} to ${endDate.getFullYear()}${timespan}`;
                        })()}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        paddingX: "1rem",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="subtitle2">
                        {employment?.job_title
                          ? employment?.job_title
                          : "unknown job title"}
                      </Typography>
                      <Typography variant="subtitle2">
                        {employment?.classification
                          ? employment?.classification
                          : "unknown job classification"}
                      </Typography>
                    </Grid>
                    <Grid item sx={{ display: "flex", gap: "0.5rem" }}>
                      {employment?.aligned_with_academic_program && (
                        <Chiptip
                          icon={<CheckCircle color="primary" />}
                          label="academically aligned"
                          actual="this job is aligned with their graduated academic program"
                        />
                      )}
                      {employment?.address ? (
                        <Chiptip
                          icon={<LocationOn color="primary" />}
                          label={employment?.address}
                        />
                      ) : (
                        <Chiptip
                          icon={<LocationOn color="primary" />}
                          label={employment?.country}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Divider>
                        <Typography variant="subtitle2">
                          job snapshot
                        </Typography>
                      </Divider>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        <Tooltip color="secondary" title="gross monthly income">
                          {employment?.gross_monthly_income}
                        </Tooltip>
                      </Typography>
                    </Grid>

                    <Box
                      sx={{
                        display: "flex",
                        paddingY: 1,
                        width: "100%",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Chiptip
                        icon={<Description color="primary" />}
                        label={
                          <Typography>
                            {employment?.employment_contract}
                          </Typography>
                        }
                        actual="employment contract"
                      />
                      <Chiptip
                        icon={<Business color="primary" />}
                        label={
                          <Typography>{employment?.employer_type}</Typography>
                        }
                        actual="employer type"
                      />
                      <Chiptip
                        icon={<Work color="primary" />}
                        label={
                          <Typography>{employment?.job_position}</Typography>
                        }
                        actual="job position"
                      />
                    </Box>
                  </Grid>
                </React.Fragment>
              );
            })}
          </Grid>
          {employmentID && isModalOpen.addModal ? (
            <AddEmploymentModal
              open={isModalOpen.addModal}
              onClose={() => handleCloseModal("addModal")}
            />
          ) : null}
          {employmentID && isModalOpen.editModal ? (
            <EditEmploymentModal
              open={isModalOpen.editModal}
              onClose={() => handleCloseModal("editModal")}
              employmentID={employmentID}
            />
          ) : null}

          {employmentID && isModalOpen.deleteModal ? (
            <DeleteEmploymentModal
              open={isModalOpen.deleteModal}
              onClose={() => handleCloseModal("deleteModal")}
              employmentID={employmentID}
            />
          ) : null}
        </Grid>
      </Grid>
    )
  );
};

export default EditableEmploymentProfile;
