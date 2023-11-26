import useLogout from "../../hooks/useLogout";
import dayjs from 'dayjs';
import { useNavigate, useLocation } from "react-router-dom";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Fab,
  Grid,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Cake,
  CheckCircleSharp,
  Edit,
  Email,
  EmojiEvents,
  Fingerprint,
  LocationCity,
  LocationOn,
  Phone,
  School,
} from "@mui/icons-material";
import EditableAchievementModal from "../profile_edit/EditableAchievementModal";

export const CareerProfile = ({ isLoading, data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();

  const Chiptip = ({ icon, label, additional = "", actual = "" }) => (
    <Tooltip
      color="secondary"
      title={actual !== "" ? actual : additional + label}
      sx={{ padding: "0.5rem" }}
    >
      <Chip icon={icon} label={label} />
    </Tooltip>
  );

  if (isLoading) {
    return (
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          marginY: "2rem",
        }}
      >
        <Grid
          container
          spacing={1}
          xs={12}
          m="0, auto"
          gap={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              padding: 1,
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
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
                fontWeight: "bold",
                height: "100%",
              }}
            >
              <Skeleton width={200} />
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Divider sx={{ padding: 2.5 }}>
              <Typography variant="subtitle2">
                <Skeleton width={200} />
              </Typography>
            </Divider>
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {[1, 2].map((index) => (
                <Skeleton
                  key={index}
                  variant="circular"
                  width={40}
                  height={40}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Divider sx={{ padding: 2.5 }}>
              <Typography variant="subtitle2">
                <Skeleton width={200} />
              </Typography>
            </Divider>
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {[1, 2].map((index) => (
                <Skeleton
                  key={index}
                  variant="circular"
                  width={40}
                  height={40}
                />
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Divider sx={{ padding: 2.5, width: "100%" }}>
              <Typography variant="subtitle2">
                <Skeleton width={200} />
              </Typography>
            </Divider>
            <Box sx={{ position: "relative", margin: " auto 0" }}>
              <Typography
                variant="h1"
                sx={{
                  display: "block",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                &ldquo;
              </Typography>
              <Skeleton
                variant="rectangular"
                height={150}
                width="100%"
                sx={{
                  height: "100%",
                  padding: "1.5rem",
                  maxWidth: "50ch",
                  whiteSpace: "wrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  position: "relative",
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  display: "block",
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                }}
              >
                &rdquo;
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative", // Add relative positioning to the container
        marginY: "2rem",
      }}
    >
      <Grid
        container
        spacing={1} // Set the width spacing to 2.5
        xs={12}
        m="0, auto"
        gap={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            padding: 1,
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
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
              height: "100%", // Consume available vertical space
              width: "100%",
            }}
          >
            {data?.data?.course ? data?.data?.course : "no course selected"}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {data?.data?.date_graduated && (
              <Chiptip
                icon={<School color="primary" />}
                label={dayjs(data?.data?.date_graduated).format("YYYY")}
                additional="batch "
              />
            )}
          </Box>
        </Box>
        <Box sx={{ width: "100%" }}>
          {data?.data?.post_grad_act && (
            <Divider sx={{ padding: 2.5 }}>
              <Typography variant="subtitle2">
                post graduation activities
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
            {data?.data?.post_grad_act &&
              data?.data?.post_grad_act.map((activity, index) => (
                <Chiptip
                  key={index}
                  icon={<CheckCircleSharp color="primary" />}
                  label={activity}
                />
              ))}
          </Box>
        </Box>

        {data?.data?.achievement?.length != 0 && (
          <Box sx={{ width: "100%" }}>
            <Divider sx={{ padding: 2.5 }}>
              <Typography variant="subtitle2">alumni achievements</Typography>
            </Divider>
            <EditableAchievementModal />
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default CareerProfile;
