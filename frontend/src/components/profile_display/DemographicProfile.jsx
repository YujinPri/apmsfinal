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
  Contacts,
  Edit,
  Email,
  Female,
  Fingerprint,
  LocationOn,
  Male,
  Phone,
  PhoneAndroid,
  Transgender,
} from "@mui/icons-material";

export const DemographicProfile = ({data, isLoading}) => {
  const Chiptip = ({ icon, label, additional = "", actual = "" }) => (
    <Tooltip
      color="secondary"
      title={actual !== "" ? actual : additional + label}
      sx={{ padding: "0.5rem" }}
    >
      <Chip icon={icon} label={label} />
    </Tooltip>
  );

  const Gender = ({ gender }) => {
    const commonIconProps = { color: "primary" };

    switch (gender.toLowerCase()) {
      case "male":
        return <Male {...commonIconProps} />;
      case "female":
        return <Female {...commonIconProps} />;
      case "lgbtqia+":
        return <Transgender {...commonIconProps} />;
      default:
        return null;
    }
  };

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
          <Divider sx={{ padding: 2 }}>
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
          <Typography variant="subtitle1">@{data?.data?.username}</Typography>
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
                  marginX: "auto",
                }}
              >
                {data?.data?.first_name} {data?.data?.last_name}
                {data?.data?.student_number && (
                  <Typography variant="subtitle2">
                    {data?.data?.student_number}
                  </Typography>
                )}
              </Typography>
            )}

            {data?.data?.address && (
              <Tooltip title="current residence address">
                <Typography
                  variant="subtitle2"
                  sx={{
                    height: "100%",
                    padding: "0 1rem",
                    marginX: "auto",
                  }}
                >
                  {data?.data?.address}
                </Typography>
              </Tooltip>
            )}

            {data?.data?.headline && (
              <Box
                sx={{
                  position: "relative",
                  margin: " auto 0",
                  marginY: "1rem",
                }}
              >
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
                  variant="subtitle1"
                  sx={{
                    // fontWeight: "bold", // Make the text bold
                    height: "100%", // Consume available vertical space
                    padding: "1rem",
                    width: "40ch",
                    position: "relative", // Make the main content container relative for positioning
                    textAlign: "center",
                  }}
                >
                  {data?.data.headline}
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
            )}
          </Box>
        </Grid>
        {data?.data?.origin_address && (
          <Divider sx={{ padding: 2 }}>
            <Typography variant="subtitle2">home town</Typography>
          </Divider>
        )}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            paddingY: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {data?.data?.origin_address && (
            <Chiptip
              icon={<LocationOn color="primary" />}
              label={data?.data?.origin_address}
            />
          )}
        </Box>
        {(data?.data?.contact_number ||
          data?.data?.telephone_number ||
          data?.data?.email) && (
          <Divider sx={{ padding: 2 }}>
            <Typography variant="subtitle2">contact details</Typography>
          </Divider>
        )}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            paddingY: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {data?.data?.email && (
            <Chiptip
              icon={<Email color="primary" />}
              label={data?.data?.email}
            />
          )}
          {data?.data?.mobile_number && (
            <Chiptip
              icon={<PhoneAndroid color="primary" />}
              label={data?.data?.mobile_number}
            />
          )}
          {data?.data?.telephone_number && (
            <Chiptip
              icon={<Phone color="primary" />}
              label={data?.data?.telephone_number}
            />
          )}
        </Box>

        {(data?.data?.birthdate || data?.data?.civil_status) && (
          <Divider sx={{ padding: 2 }}>
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
          {data?.data?.gender && (
            <Chiptip
              icon={<Gender gender={data.data.gender} />}
              label={data?.data?.gender}
            />
          )}
        </Box>
      </Box>
    </Grid>
  );
};

export default DemographicProfile;
