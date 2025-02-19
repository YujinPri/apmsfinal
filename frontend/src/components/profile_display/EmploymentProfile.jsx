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

export const EmploymentProfile = ({data, isLoading}) => {
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
                      sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                    >
                      {employment.company_name}
                    </Typography>
                    <Chiptip
                      label={(() => {
                        const startDate = new Date(employment.date_hired);
                        if (!employment.date_end)
                          return "active job since " + startDate.getFullYear();
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
                    <Typography
                      variant="subtitle2"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {employment?.job_title
                        ? employment?.job_title
                        : "unknown job title"}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ textTransform: "capitalize" }}
                    >
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
                      <Typography variant="subtitle2">job snapshot</Typography>
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
      </Grid>
    )
  );
};

export default EmploymentProfile;
