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
  FormatQuote,
  LocationOn,
  Male,
  Phone,
  PhoneAndroid,
  Transgender,
} from "@mui/icons-material";

export const DemographicProfile = ({ data, isLoading }) => {
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
          flexDirection: "column",
        }}
      >
        <Avatar
          alt="Profile"
          src={data?.data?.profile_picture || undefined}
          sx={{ width: "100px", height: "100px" }}
        />
        <Typography variant="subtitle1">@{data?.data?.username}</Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {data?.data?.first_name && data?.data?.last_name && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textTransform: "capitalize",
              }}
            >
              {data?.data?.first_name} {data?.data?.last_name}
            </Typography>
          )}
          {data?.data?.student_number && (
            <Typography variant="subtitle2">
              {data?.data?.student_number}
            </Typography>
          )}
        </Box>

        {data?.data?.address && (
          <Tooltip title="current residence address">
            <Typography variant="subtitle1">{data?.data?.address}</Typography>
          </Tooltip>
        )}

        {data?.data?.headline && (
          <Box
            sx={{
              marginY: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography>
              <FormatQuote />
            </Typography>
            <Typography>{data?.data.headline}</Typography>
          </Box>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        {data?.data?.origin_address && (
          <Divider>
            <Typography variant="subtitle2">Home Town</Typography>
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
          {data?.data?.origin_address && (
            <Chiptip
              icon={<LocationOn color="primary" />}
              label={data?.data?.origin_address}
            />
          )}
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        {(data?.data?.contact_number ||
          data?.data?.telephone_number ||
          data?.data?.email) && (
          <Divider sx={{ padding: 2 }}>
            <Typography variant="subtitle2">Contact Details</Typography>
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
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        {(data?.data?.birthdate || data?.data?.civil_status) && (
          <Divider sx={{ padding: 2 }}>
            <Typography variant="subtitle2">Personal Details</Typography>
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
      </Grid>
    </Grid>
  );
};

export default DemographicProfile;
