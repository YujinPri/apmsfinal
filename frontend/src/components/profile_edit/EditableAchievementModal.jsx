import { styled } from "@mui/material/styles";
import React, { useState } from "react";
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
  AddCircleRounded,
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

  const handleExpandClick = (achievementId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [achievementId]: !prevExpanded[achievementId],
    }));
  };

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [isModalOpen, setModalOpen] = useState({
    addModal: false,
    editModal: false,
    deleteModal: false,
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
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
                <Card
                  sx={{ width: "100%" }} key={index}
                >
                  <CardContent
                    sx={{
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
                      container
                      sx={{ display: "flex", flexDirection: "column" }}
                    >
                      <Grid item sx={{ marginBottom: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {achievement?.type_of_achievement}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {achievement?.year_of_attainment}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Box
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "center",
                            width: "80%",
                          }}
                        >
                          <Star />
                          <Typography
                            variant="body2"
                            style={{ wordBreak: "break-word" }}
                          >
                            {achievement?.description}
                          </Typography>
                        </Box>
                      </Grid>
                      {achievement?.story || achievement?.link_reference ? (
                        <>
                          <CardActions
                            sx={{
                              position: "absolute",
                              bottom: "0rem",
                              right: "1rem",
                            }}
                          >
                            <ExpandMore
                              expand={isExpanded}
                              onClick={() => handleExpandClick(achievement.id)}
                              aria-expanded={isExpanded}
                              aria-label="show more"
                            >
                              <ExpandMoreIcon />
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
                                  variant="subtitle2"
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
                                    click to see more about this achievement
                                    here
                                  </Link>
                                </Typography>
                              ) : null}
                            </CardContent>
                          </Collapse>
                        </>
                      ) : null}
                    </Grid>
                  </CardContent>
                </Card>
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
    )
  );
};

export default EditableAchievementModal;
