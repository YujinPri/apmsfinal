import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";
import { Stars } from "@mui/icons-material";

export const Profile = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();

  const getProfile = async () => {
    return await axiosPrivate.get("/users/me");
  };

  const { isLoading, data, isError, error, isFetching } = useQuery(
    "profile-me",
    getProfile,
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
  }

  if (isLoading) {
    return (
      <Card
        variant="outlined"
        sx={{
          backgroundColor: (theme) => theme.palette.secondary.main,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Skeleton variant="rectangular" width={40} height={20} />
            <Skeleton variant="rectangular" width={40} height={20} />
            <Skeleton variant="rectangular" width={40} height={20} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Skeleton variant="circular" width={60} height={60} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.2 }}>
              <Skeleton variant="rectangular" width={120} height={24} />
              <Skeleton variant="rectangular" width={100} height={16} />
              <Skeleton variant="rectangular" width={80} height={16} />
            </Box>
          </Box>
          <Skeleton
            variant="rectangular"
            width={80}
            height={16}
            sx={{ marginLeft: "auto", marginTop: 0.5 }}
          />
        </CardContent>
      </Card>
    );
  }

  let headline = "Time is Gold"; // Define a default value or fetch it from data if necessary
  if (data?.data) {
    headline = data?.data?.employments?.reduce((prev, current) => {
      if (current.date_end === null) {
        if (prev === null) {
          return current;
        }
        if (new Date(current.date_hired) > new Date(prev.date_hired)) {
          return current;
        }
      }
      if (!prev) return data?.data?.present_employment_status;
      return prev;
    }, null);
  }

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Card
        variant="outlined"
        sx={{
          backgroundColor: (theme) => theme.palette.secondary.main,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <CardActionArea component={RouterLink} to="/profile/me">
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Stars fontSize="small" />
              <Stars fontSize="small" />
              <Stars fontSize="small" />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                alt="Profile"
                src={data?.data.profile_picture}
                sx={{ width: "60px", height: "60px" }}
              />
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{ textTransform: "lowercase" }}
                >
                  {data?.data.first_name + " " + data?.data.last_name}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  gutterBottom
                  style={{ lineHeight: 1 }}
                >
                  {headline}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  gutterBottom
                  style={{ lineHeight: 1 }}
                >
                  batch {data?.data.year_graduated}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "end" }}
            >
              {data.role}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default Profile;
