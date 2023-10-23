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
import ProfileEditModal from "./ProfileEditModal";
import {
  Cake,
  Edit,
  Email,
  Fingerprint,
  LocationOn,
  Phone,
} from "@mui/icons-material";

export const DemographicProfile = () => {
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
    return await axiosPrivate.get("/profiles/demographic_profile/me");
  };

  const { isLoading, data, isError, error, isFetching } = useQuery(
    "demographic-profile",
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
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 2,
            }}
          >
            <Skeleton variant="circular" width={100} height={100} />
            <Typography variant="h6">
              <Skeleton width={100} />
            </Typography>
          </Box>
          <Grid
            container
            spacing={1}
            xs={12}
            m="0, auto"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                borderRadius: 3,
                padding: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                gap={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  padding: "0 1rem",
                  fontWeight: "bold",
                }}
              >
                <Skeleton width={200} />
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  height: "100%",
                  padding: "0 1rem",
                }}
              >
                <Skeleton width={200} />
              </Typography>
              <Skeleton
                variant="rectangular"
                height={40}
                sx={{
                  height: "100%",
                  padding: "0 1.5rem",
                  marginTop: "1rem",
                  maxWidth: "60ch",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1, paddingY: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
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
            <Skeleton variant="circular" width={40} height={40} />
          </Fab>
          <Divider sx={{ padding: 2.5 }}>
            <Typography variant="subtitle2">
              <Skeleton width={200} />
            </Typography>
          </Divider>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={200} />
          </Box>
        </Box>
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
        position: "relative",
        marginY: "2rem",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Avatar
            alt="Profile"
            src={data?.data?.profile_picture || undefined}
            sx={{ width: "100px", height: "100px" }}
          />
          <Typography variant="h6">@{data?.data?.username}</Typography>
        </Box>
        <Grid
          container
          spacing={1}
          xs={12}
          m="0, auto"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              borderRadius: 3,
              padding: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {data?.data?.first_name && data?.data?.last_name && (
              <Typography
                variant="h6"
                gap={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  padding: "0 1rem",
                  fontWeight: "bold",
                }}
              >
                {data?.data?.first_name} {data?.data?.last_name}
                {data?.data?.student_number && (
                  <Typography variant="subtitle2">
                    ({data?.data?.student_number})
                  </Typography>
                )}
              </Typography>
            )}

            {data?.data?.city && (
              <Typography
                variant="subtitle1"
                sx={{
                  height: "100%",
                  padding: "0 1rem",
                }}
              >
                {!data?.data?.region ? (
                  <>{data?.data?.city}</>
                ) : (
                  <>
                    {data?.data?.city}, {data?.data?.region}
                  </>
                )}
              </Typography>
            )}

            {data?.data?.headline && (
              <Typography
                variant="subtitle1"
                sx={{
                  height: "100%",
                  padding: "0 1.5rem",
                  marginTop: "1rem",
                  maxWidth: "60ch",
                  whiteSpace: "wrap",
                  // overflow: "hidden",
                  // textOverflow: "ellipsis",
                }}
              >
                {data?.data.headline}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 1, paddingY: 2 }}>
            {data?.data?.email && (
              <Chiptip
                icon={<Email color="primary" />}
                label={data?.data?.email}
              />
            )}

            {data?.data?.mobile_number && (
              <Chiptip
                icon={<Phone color="primary" />}
                label={data?.data?.mobile_number}
              />
            )}
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
          onClick={() => handleModalOpen()}
        >
          <Edit />
        </Fab>
        {(data?.data?.birthdate ||
          data?.data?.civil_status ||
          data?.data?.address) && (
          <Divider sx={{ padding: 2.5 }}>
            <Typography variant="subtitle2">personal details</Typography>
          </Divider>
        )}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {data?.data?.birthdate && (
            <Chiptip
              icon={<Cake color="primary" />}
              label={data?.data?.birthdate}
            />
          )}
          {data?.data?.civil_status && (
            <Chiptip
              icon={<Fingerprint color="primary" />}
              label={data?.data?.civil_status}
            />
          )}
          {data?.data?.address && (
            <Chiptip
              icon={<LocationOn color="primary" />}
              label={
                <Typography
                  sx={{
                    maxWidth: "15ch",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {data?.data?.address}
                </Typography>
              }
              actual={data?.data?.address}
            />
          )}
        </Box>
      </Box>
      {
        <ProfileEditModal
          open={isModalOpen}
          onClose={handleCloseModal}
        />
      }
    </Grid>
  );
};

export default DemographicProfile;
