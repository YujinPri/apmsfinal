import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
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
import DeleteAchievementModal from "./DeleteAchievementModal";
import EditAchievementModal from "./EditAchievementModal";

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

export const EditableAchievementModal = () => {
  const [expanded, setExpanded] = React.useState({});
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleExpandClick = (achievementId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [achievementId]: !prevExpanded[achievementId],
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
  });

  const [achievementID, setAchievementID] = useState(null);

  const handleModalOpen = (type, id) => {
    setAchievementID(id);
    setModalOpen((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type) => {
    setModalOpen((prev) => ({ ...prev, [type]: false }));
    setAchievementID("");
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

  const getData = async () => {
    return await axiosPrivate.get("/profiles/achievement/me");
  };

  const { isLoading, data, isError, error, isFetching } = useQuery(
    "achievements-profile",
    getData
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

  return (
    data?.data?.achievements && (
      <Grid
        item
        sx={{
          backgroundColor: (theme) => theme.palette.common.main,
          padding: "1rem",
          position: "relative",
        }}
        id="achievement_background"
      >
        <Typography
          variant="h5"
          fontWeight={800}
          // color="secondary"
          sx={{
            padding: "10px",
            borderBottom: "2px solid",
            marginBottom: "10px",
            color: "primary",
          }}
        >
          Achievements
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
          <Tooltip title="add achievement">
            <Fab
              size="small"
              onClick={() => handleModalOpen("add_achievement")}
              color="primary"
            >
              <Add />
            </Fab>
          </Tooltip>
        </Box>
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "stretch",
              gap: 2,
              flexDirection: "column",
              width: "80%",
            }}
          >
            {data?.data?.achievements.map((achievement, index) => {
              const isExpanded = expanded[achievement.id];
              return (
                <React.Fragment key={achievement.id}>
                  <Grid
                    container
                    sx={{
                      display: "flex",
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
                              right: "0rem",
                            }}
                          >
                            <MoreHoriz color="primary" />
                          </Button>
                          <Menu {...bindMenu(popupState)}>
                            <MenuItem
                              onClick={() =>
                                handleModalOpen("editModal", achievement.id)
                              } // Trigger the profile edit modal
                            >
                              <ListItemIcon>
                                <Edit fontSize="small" />
                              </ListItemIcon>
                              edit
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleModalOpen("deleteModal", achievement.id)
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
                        {achievement?.type_of_achievement}
                      </Typography>
                      <Typography variant="subtitle2">
                        <Chiptip
                          label={dayjs(achievement?.date_of_attainment).format(
                            "YYYY"
                          )}
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Typography variant="body2">
                          {achievement?.description}
                        </Typography>
                      </Box>
                    </Grid>

                    {achievement?.story || achievement?.link_reference ? (
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
                            onClick={() => handleExpandClick(achievement.id)}
                            aria-expanded={isExpanded}
                            aria-label="show more"
                          >
                            <Tooltip title="show more">
                              <ExpandMoreIcon />
                            </Tooltip>
                          </ExpandMore>
                        </CardActions>
                        <Collapse
                          in={expanded[achievement.id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <CardContent>
                            {achievement?.story ? (
                              <Typography
                                variant="body1"
                                style={{ wordBreak: "break-word" }}
                              >
                                {achievement?.story}
                              </Typography>
                            ) : null}
                            {achievement?.link_reference ? (
                              <Typography variant="subtitle2">
                                <Link
                                  href={achievement?.link_reference}
                                  target="_blank"
                                >
                                  click to see more about this achievement here
                                </Link>
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
          </Box>
          {achievementID && (
            <>
              <EditAchievementModal
                open={isModalOpen.editModal}
                onClose={() => handleCloseModal("editModal")}
                achievementID={achievementID}
              />
              <DeleteAchievementModal
                open={isModalOpen.deleteModal}
                onClose={() => handleCloseModal("deleteModal")}
                achievementID={achievementID}
              />
            </>
          )}
        </Grid>
      </Grid>
    )
  );
};

export default EditableAchievementModal;
