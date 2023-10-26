import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
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
import EducProfileEditModal from "./EducProfileEditModal";

export const EducationalProfile = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleCloseModal = async () => {
    setModalOpen(false);
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
    return await axiosPrivate.get("/profiles/educational_profile/me");
  };

  const { isLoading, data, isError, error, isFetching } = useQuery(
    "educational-profile",
    getData,
    {
      staleTime: 300000,
      // refetchOnWindowFocus: true,
    }
  );

  if (isError) {
    if (error.response.data.detail === "Token has expired") {
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
    // console.log("nani");
  }

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

        <Fab
          size="small"
          color="primary"
          sx={{
            position: "absolute",
            top: "-1rem",
            right: "1rem",
          }}
        >
          <Edit />
        </Fab>
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
          {data?.data?.degree && data?.data?.field && (
            <Typography
              variant="h6"
              gap={1}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "0 1rem",
                fontWeight: "bold", // Make the text bold
                height: "100%", // Consume available vertical space
              }}
            >
              {data?.data?.degree} in {data?.data?.field}
            </Typography>
          )}
          <Box sx={{ display: "flex", gap: 1 }}>
            {data?.data?.year_graduated && (
              <Chiptip
                icon={<School color="primary" />}
                label={data?.data.year_graduated}
                additional="batch "
              />
            )}
            {data?.data?.civil_service_eligibility && (
              <Chiptip
                icon={<LocationCity color="primary" />}
                label="civil service eligible"
              />
            )}
          </Box>
        </Box>
        <Box sx={{ width: "100%" }}>
          {data?.data?.honors_and_awards && (
            <Divider sx={{ padding: 2.5 }}>
              <Typography variant="subtitle2">honors and awards</Typography>
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
            {data?.data?.honors_and_awards &&
              data?.data?.honors_and_awards.map((activity, index) => (
                <Chiptip
                  key={index}
                  icon={<EmojiEvents color="primary" />}
                  label={activity}
                />
              ))}
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
        {data?.data?.achievements_story && (
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
                pup achievements story
              </Typography>
            </Divider>
            <Box sx={{ position: "relative", margin: " auto 0" }}>
              <Typography
                variant="h1" // You can adjust the variant to match your preferred heading style
                sx={{
                  display: "block", // Display the quotation marks as blocks
                  position: "absolute", // Position them absolutely within the parent container
                  top: 0, // Position at the top
                  left: 0, // Position at the left
                }}
              >
                &ldquo;
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  // fontWeight: "bold", // Make the text bold
                  height: "100%", // Consume available vertical space
                  padding: "1.5rem",
                  maxWidth: "50ch", // Maximum width of 40 characters
                  whiteSpace: "wrap", // Prevent text from wrapping to the next line
                  overflow: "hidden", // Hide overflow text
                  textOverflow: "ellipsis", // Display ellipsis (...) when text overflows
                  position: "relative", // Make the main content container relative for positioning
                }}
              >
                {data?.data?.achievements_story}
              </Typography>
              <Typography
                variant="h1" // You can adjust the variant to match your preferred heading style
                sx={{
                  display: "block", // Display the quotation marks as blocks
                  position: "absolute", // Position them absolutely within the parent container
                  bottom: 0, // Position at the bottom
                  right: 0, // Position at the right
                }}
              >
                &rdquo;
              </Typography>
            </Box>
          </Box>
        )}
      </Grid>

      <Fab
        size="small"
        color="primary"
        sx={{
          position: "absolute", // Use absolute positioning
          top: "-1rem", // Adjust top position as needed
          right: "1rem", // Adjust right position as needed
        }}
        onClick={() => handleModalOpen()} // Trigger the profile edit modal
      >
        <Edit />
      </Fab>
      {
        <EducProfileEditModal
          open={isModalOpen}
          onClose={handleCloseModal}
        />
      }
    </Grid>
  );
};

export default EducationalProfile;
