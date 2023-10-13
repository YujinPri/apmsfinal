import React from "react";
import {
  Grid,
  Box,
  Avatar,
  Typography,
  Divider,
  Fab,
  Skeleton,
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
              <Edit />
            </Fab>
            <Divider sx={{ padding: 2.5 }}>
              <Typography variant="subtitle2">personal details</Typography>
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
            <Box>
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
                      honors and awards
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
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="circular" width={40} height={40} />
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Divider sx={{ padding: 2.5 }}>
                    <Typography variant="subtitle2">
                      post graduation activities
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
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="circular" width={40} height={40} />
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
                      pup achievements story
                    </Typography>
                  </Divider>
                  <Box sx={{ position: "relative", margin: " auto 0" }}>
                    <Typography
                      variant="h1"
                      sx={{
                        display: "block",
                        position: "absolute",
                        top: -25,
                        left: -25,
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
                        maxWidth: "40ch",
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
                        bottom: -25,
                        right: -25,
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
            </Box>
          </Grid>
        );
    default:
      return <>loading...</>;
  }
}

export default UpdateProfileSkeleton;
