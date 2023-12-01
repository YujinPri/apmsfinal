import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import EducProfileEditModal from "./EditCareerModal";
import useGetEducationProfiles from "../../hooks/useGetEducationProfiles";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Fab,
  Grid,
  Icon,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Skeleton,
  Tooltip,
  Typography,
  Link,
} from "@mui/material";
import {
  Add,
  AddCircleRounded,
  ArrowBack,
  BackHand,
  BusinessRounded,
  Cake,
  CheckCircle,
  CheckCircleSharp,
  Delete,
  DeleteForever,
  Edit,
  Email,
  EmojiEmotions,
  EmojiEvents,
  Favorite,
  FavoriteRounded,
  Fingerprint,
  GradeRounded,
  LocalBar,
  LocationCity,
  LocationOn,
  MoreHoriz,
  PartyMode,
  PartyModeOutlined,
  PartyModeRounded,
  Phone,
  PublicRounded,
  School,
  Share,
  Star,
  Work,
  WorkOutline,
  WorkOutlined,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditEducationModal from "./EditEducationModal";
import DeleteEducationModal from "./DeleteEducationModal";
import useGetCareerProfile from "../../hooks/useGetCareerProfile";
import AddEducationModal from "./AddEducationModal";
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const EditableEducationProfile = () => {
  const [expanded, setExpanded] = React.useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleExpandClick = (educationId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [educationId]: !prevExpanded[educationId],
    }));
  };

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";
  const { auth, setAuth } = useAuth();
  const [isModalOpen, setModalOpen] = useState({
    addModal: false,
    editModal: false,
    deleteModal: false,
    addEducation: false,
    career: false,
  });

  const [educationID, setEducationID] = useState(null);

  const handleModalOpen = (type, id) => {
    setEducationID(id);
    setModalOpen((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type) => {
    setModalOpen((prev) => ({ ...prev, [type]: false }));
    setEducationID("");
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

  const { isLoading, data, isError, error, isFetching } =
    useGetEducationProfiles();
  const {
    data: careerData,
    isLoading: isLoadingCareerData,
    isError: isErrorCareerData,
    error: errorCareerData,
  } = useGetCareerProfile();

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

  return (
    <Grid
      item
      sx={{
        backgroundColor: (theme) => theme.palette.common.main,
        padding: "1rem",
        position: "relative",
      }}
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
        Education
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
        <Tooltip title="add education">
          <Fab
            size="small"
            onClick={() => handleModalOpen("addEducation", 1)}
            color="primary"
          >
            <Add />
          </Fab>
        </Tooltip>
        <Tooltip title="Edit PUP Background">
          <Fab
            size="small"
            color="primary"
            onClick={() => handleModalOpen("career", 1)}
          >
            <Edit />
          </Fab>
        </Tooltip>
      </Box>
      <Grid
        container
        sx={{
          display: "flex",
          marginY: "2rem",
          gap: 3,
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h6"
            gap={1}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "0 1rem",
              fontWeight: "bold", // Make the text bold
              textTransform: "capitalize",
            }}
          >
            {careerData?.data?.course
              ? careerData?.data?.course
              : "No Background in PUPQC"}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {careerData?.data?.date_graduated && (
              <Chiptip
                icon={<School color="primary" />}
                label={dayjs(careerData?.data?.date_graduated).format("YYYY")}
                additional="year graduated: "
              />
            )}
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {careerData?.data?.post_grad_act && (
            <Divider>
              <Typography variant="subtitle2">
                Post Graduation Activities
              </Typography>
            </Divider>
          )}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap", // Allow content to wrap onto the next line
            }}
          >
            {careerData?.data?.post_grad_act &&
              careerData?.data?.post_grad_act.map((activity, index) => (
                <Chiptip
                  key={index}
                  icon={<CheckCircleSharp color="primary" />}
                  label={activity}
                />
              ))}
          </Box>
        </Grid>

        {careerData?.data?.achievement?.length != 0 && (
          <Grid
            item
            xs={12}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Divider>
              <Typography variant="subtitle2">
                Education Outside PUPQC
              </Typography>
            </Divider>
          </Grid>
        )}
      </Grid>
      {data?.data?.educations && (
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            paddingX: "2rem",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Grid
            item
            sx={{
              display: "flex",
              justifyContent: "stretch",
              gap: 2,
              flexDirection: "column",
              width: "100%",
            }}
          >
            {data?.data?.educations?.map((education, index) => {
              const isExpanded = expanded[education.id];
              return (
                <React.Fragment key={education.id}>
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      position: "relative",
                      marginBottom: "0.5rem",
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
                              right: "0rem",
                            }}
                          >
                            <MoreHoriz color="primary" />
                          </Button>
                          <Menu {...bindMenu(popupState)}>
                            <MenuItem
                              onClick={() =>
                                handleModalOpen("editModal", education.id)
                              } // Trigger the profile edit modal
                            >
                              <ListItemIcon>
                                <Edit fontSize="small" />
                              </ListItemIcon>
                              edit
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleModalOpen("deleteModal", education.id)
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
                          textTransform: "capitalize",
                        }}
                      >
                        {education?.school_name}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {education?.address
                          ? education?.address
                          : education?.country}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        gap: "1rem",
                      }}
                    >
                      <Tooltip title="education course">
                        <Typography
                          variant="body2"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {education?.course?.name}
                        </Typography>
                      </Tooltip>
                      <Tooltip title="education level">
                        <Typography
                          variant="body2"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {education?.level}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        gap: "0.5rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ textTransform: "capitalize" }}
                      >
                        <Chiptip
                          label={dayjs(education?.date_start).format(
                            "MMMM YYYY"
                          )}
                        />
                      </Typography>
                      {education?.date_graduated ? (
                        <Typography variant="subtitle2">to</Typography>
                      ) : null}
                      {education?.date_graduated ? (
                        <Typography
                          variant="subtitle2"
                          sx={{ textTransform: "capitalize" }}
                        >
                          <Chiptip
                            label={dayjs(education?.date_graduated).format(
                              "MMMM YYYY"
                            )}
                          />
                        </Typography>
                      ) : null}
                      {!education?.date_graduated ? (
                        <Typography variant="subtitle2">
                          <Chiptip label={"Currently Studying"} />
                        </Typography>
                      ) : null}
                      <Divider />
                    </Grid>
                    {education?.story || education?.link_reference ? (
                      <>
                        <CardActions
                          sx={{
                            position: "absolute",
                            bottom: "-1rem",
                            right: "0.25rem",
                          }}
                        >
                          <ExpandMore
                            expand={isExpanded}
                            onClick={() => handleExpandClick(education.id)}
                            aria-expanded={isExpanded}
                            aria-label="show more"
                          >
                            <Tooltip title="show more">
                              <ExpandMoreIcon />
                            </Tooltip>
                          </ExpandMore>
                        </CardActions>
                        <Collapse
                          in={expanded[education.id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <CardContent>
                            {education?.story ? (
                              <Typography
                                variant="body1"
                                style={{ wordBreak: "break-word" }}
                              >
                                {education?.story}
                              </Typography>
                            ) : null}
                          </CardContent>
                        </Collapse>
                      </>
                    ) : null}
                    <Divider />
                  </Grid>
                </React.Fragment>
              );
            })}
          </Grid>
          {educationID && isModalOpen.editModal ? (
            <EditEducationModal
              open={isModalOpen.editModal}
              onClose={() => handleCloseModal("editModal")}
              educationID={educationID}
            />
          ) : null}
          {educationID && isModalOpen.deleteModal ? (
            <DeleteEducationModal
              open={isModalOpen.deleteModal}
              onClose={() => handleCloseModal("deleteModal")}
              educationID={educationID}
            />
          ) : null}
          {isModalOpen.career ? (
            <EducProfileEditModal
              open={isModalOpen.career}
              onClose={() => handleCloseModal("career")}
            />
          ) : null}
          {isModalOpen.addEducation ? (
            <AddEducationModal
              open={isModalOpen.addEducation}
              onClose={() => handleCloseModal("addEducation")}
            />
          ) : null}
        </Grid>
      )}
    </Grid>
  );
};

export default EditableEducationProfile;
