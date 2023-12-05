import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import useGetAchievementProfiles from "../../hooks/useGetAchievementProfiles";

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

export const AchievementProfile = ({data, isLoading}) => {
  const [expanded, setExpanded] = React.useState({});

  const handleExpandClick = (achievementId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [achievementId]: !prevExpanded[achievementId],
    }));
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



  return (
    data?.data?.achievements && (
      <Grid
        container
        sx={{
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
            gap: 1,
            paddingX: "1rem",
            flexDirection: "column",
          }}
        >
          {data?.data?.achievements.map((achievement, index) => {
            const isExpanded = expanded[achievement.id];
            return (
              <React.Fragment key={achievement.id}>
                <Grid
                  container
                  sx={{
                    marginBottom: "0.5rem",
                    borderBottom: "1px #aaa solid",
                    paddingY: "0.5rem",
                    position: "relative",
                  }}
                >
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
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {achievement?.type_of_achievement}
                    </Typography>
                    <Chiptip
                      label={dayjs(achievement?.date_of_attainment).format(
                        "YYYY"
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      {achievement?.description}
                    </Typography>
                  </Grid>
                  {achievement?.story || achievement?.link_reference ? (
                    <>
                      <CardActions
                        sx={{
                          position: "absolute",
                          right: "-1.5rem",
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
        </Grid>
      </Grid>
    )
  );
};

export default AchievementProfile;
