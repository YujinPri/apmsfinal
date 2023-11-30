import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import useGetEducationProfiles from "../../hooks/useGetEducationProfiles";
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

export const OtherEducationProfile = () => {
  const [expanded, setExpanded] = React.useState({});

  const handleExpandClick = (educationId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [educationId]: !prevExpanded[educationId],
    }));
  };

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();

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
    data?.data?.educations && (
      <Grid
        container
        sx={{
          display: "flex",
          gap: 3,
          position: "relative",
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
          {data?.data?.educations?.map((education, index) => {
            const isExpanded = expanded[education.id];
            return (
              <React.Fragment key={education.id}>
                <Grid
                  container
                  sx={{
                    position: "relative",
                    marginBottom: "0.5rem",
                    borderBottom: "1px #aaa solid",
                    paddingY: "0.5rem",
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
                    <Chiptip
                      label={dayjs(education?.date_start).format("MMMM YYYY")}
                    />
                    {education?.date_graduated ? (
                      <Typography variant="subtitle2">to</Typography>
                    ) : null}
                    {education?.date_graduated ? (
                      <Chiptip
                        label={dayjs(education?.date_graduated).format(
                          "MMMM YYYY"
                        )}
                      />
                    ) : null}
                    {!education?.date_graduated ? (
                      <Chiptip label={"Currently Studying"} />
                    ) : null}
                    <Divider />
                  </Grid>
                  {education?.story || education?.link_reference ? (
                    <>
                      <CardActions
                        sx={{
                          position: "absolute",
                          right: "-1.5rem",
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
      </Grid>
    )
  );
};

export default OtherEducationProfile;
