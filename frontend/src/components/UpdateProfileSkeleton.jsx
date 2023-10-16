import React from "react";
import {
  Grid,
  Box,
  Avatar,
  Typography,
  Divider,
  Fab,
  Skeleton,
  Card,
  CardContent,
} from "@mui/material";

import {
  Edit,
  Email,
  Phone,
  Cake,
  Fingerprint,
  LocationOn,
} from "@mui/icons-material";

function UpdateProfileSkeleton({ section }) {
  switch (section) {
    case 1:
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
    case 2:
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
    case 3:
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
        </Grid>
      );
    default:
      return <>loading...</>;
  }
}

export default UpdateProfileSkeleton;
