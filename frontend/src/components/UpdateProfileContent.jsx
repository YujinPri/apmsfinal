import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Fab,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  AddBoxRounded,
  AddCardRounded,
  AddCircleRounded,
  AssignmentTurnedInSharp,
  BusinessCenter,
  BusinessRounded,
  Cake,
  CheckCircle,
  CheckCircleSharp,
  Delete,
  DeleteForever,
  DoneSharp,
  Edit,
  Email,
  EmojiEvents,
  Face,
  Fingerprint,
  Grade,
  GradeRounded,
  LocationCity,
  LocationCityRounded,
  LocationOn,
  MoreHoriz,
  Phone,
  PublicRounded,
  School,
  VerifiedUser,
  VerifiedUserSharp,
  Work,
  WorkOutline,
} from "@mui/icons-material";

const UpdateProfileContent = ({ profile, section }) => {
  const Chiptip = ({ icon, label, additional = "", actual = "" }) => (
    <Tooltip
      color="secondary"
      title={actual !== "" ? actual : additional + label}
      sx={{ padding: "0.5rem" }}
    >
      <Chip icon={icon} label={label} />
    </Tooltip>
  );
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
              <Avatar
                alt="Profile"
                src={profile?.profile_picture || undefined}
                sx={{ width: "100px", height: "100px" }}
              />
              <Typography variant="h6">@{profile?.username}</Typography>
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
                {profile?.first_name && profile?.last_name && (
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
                    {profile.first_name} {profile.last_name}
                    {profile?.student_number && (
                      <Typography variant="subtitle2">
                        ({profile.student_number})
                      </Typography>
                    )}
                  </Typography>
                )}

                {profile?.city && (
                  <Typography
                    variant="subtitle1"
                    sx={{
                      height: "100%",
                      padding: "0 1rem",
                    }}
                  >
                    {!profile?.region ? (
                      <>{profile.city}</>
                    ) : (
                      <>
                        {profile.city}, {profile.region}
                      </>
                    )}
                  </Typography>
                )}

                {profile?.headline && (
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
                    {profile.headline}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: "flex", gap: 1, paddingY: 2 }}>
                {profile?.email && (
                  <Chiptip
                    icon={<Email color="primary" />}
                    label={profile.email}
                  />
                )}

                {profile?.mobile_number && (
                  <Chiptip
                    icon={<Phone color="primary" />}
                    label={profile.mobile_number}
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
            >
              <Edit />
            </Fab>
            {(profile?.birthdate ||
              profile?.civil_status ||
              profile?.address) && (
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
              {profile?.birthdate && (
                <Chiptip
                  icon={<Cake color="primary" />}
                  label={profile.birthdate}
                />
              )}
              {profile?.civil_status && (
                <Chiptip
                  icon={<Fingerprint color="primary" />}
                  label={profile.civil_status}
                />
              )}
              {profile?.address && (
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
                      {profile.address}
                    </Typography>
                  }
                  actual={profile.address}
                />
              )}
            </Box>
          </Box>
        </Grid>
      );
    case 2:
      return (
        <>
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
                {profile?.degree && profile?.field && (
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
                    {profile.degree} in {profile.field}
                  </Typography>
                )}
                <Box sx={{ display: "flex", gap: 1 }}>
                  {profile?.year_graduated && (
                    <Chiptip
                      icon=<School color="primary" />
                      label={profile.year_graduated}
                      additional="batch "
                    />
                  )}
                  {profile?.civil_service_eligibility && (
                    <Chiptip
                      icon=<LocationCity color="primary" />
                      label="civil service eligible"
                    />
                  )}
                </Box>
              </Box>
              <Box sx={{ width: "100%" }}>
                {profile?.honors_and_awards && (
                  <Divider sx={{ padding: 2.5 }}>
                    <Typography variant="subtitle2">
                      honors and awards
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
                  {profile?.honors_and_awards &&
                    profile.honors_and_awards.map((activity, index) => (
                      <Chiptip
                        key={index}
                        icon=<EmojiEvents color="primary" />
                        label={activity}
                      />
                    ))}
                </Box>
              </Box>
              <Box sx={{ width: "100%" }}>
                {profile?.post_grad_act && (
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
                  {profile?.post_grad_act &&
                    profile.post_grad_act.map((activity, index) => (
                      <Chiptip
                        key={index}
                        icon=<CheckCircleSharp color="primary" />
                        label={activity}
                      />
                    ))}
                </Box>
              </Box>
              {profile?.achievements_story && (
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
                      {profile.achievements_story}
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
            >
              <Edit />
            </Fab>
          </Grid>
        </>
      );
    case 3: {
      profile.employments.sort((a, b) => {
        const dateA = new Date(a.date_end);
        const dateB = new Date(b.date_end);

        if (dateA > dateB) return -1; // Sort in descending order
        else if (dateA < dateB) return 1;

        return 0;
      });

      const [anchorEl, setAnchorEl] = React.useState(null);
      const open = Boolean(anchorEl);
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };

      return (
        profile?.employments && (
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
              {profile.present_employment_status && (
                <Chiptip
                  icon={<WorkOutline color="primary" />}
                  label={
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {profile.present_employment_status}
                    </Typography>
                  }
                  actual="current employment status"
                  sx={{ alignSelf: "baseline" }}
                />
              )}
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
              {profile.employments.map((employment, index) => (
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
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {employment.company_name}
                        </Typography>
                      </Grid>
                      <Grid item sx={{ whiteSpace: "nowrap" }}>
                        <Typography variant="subtitle2">
                          {(() => {
                            const startDate = new Date(employment.date_hired);
                            if (!employment.date_end)
                              return (
                                "active job since " + startDate.getFullYear()
                              );
                            const endDate = employment.date_end
                              ? new Date(employment.date_end)
                              : "ongoing";
                            const monthsDifference =
                              (endDate.getFullYear() -
                                startDate.getFullYear()) *
                                12 +
                              (endDate.getMonth() - startDate.getMonth());

                            const yearsDifference = monthsDifference / 12; // Calculate years with decimal
                            const formattedYears =
                              yearsDifference.toFixed(1) + "0"; // Round to 2 decimal places

                            const timespan =
                              monthsDifference < 1
                                ? ""
                                : ` (${formattedYears} years)`;

                            return `${startDate.getFullYear()} to ${endDate.getFullYear()}${timespan}`;
                          })()}
                        </Typography>
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
                        <Typography
                          variant="body"
                          sx={{ textTransform: "lowercase" }}
                        >
                          {employment?.job_title}, {employment?.classification}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box sx={{ display: "flex", gap: 1, paddingY: 2 }}>
                      {employment.first_job && (
                        <Chiptip
                          icon={<Work color="primary" />}
                          label="first job "
                        />
                      )}
                      {employment.aligned_with_academic_program && (
                        <Chiptip
                          icon={<CheckCircle color="primary" />}
                          label="academically aligned"
                          actual="this job is aligned with their graduated academic program"
                        />
                      )}
                    </Box>
                    <Divider sx={{ paddingBottom: 1 }}>
                      <Typography variant="subtitle2">
                        career snapshot
                      </Typography>
                    </Divider>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        padding: 1,
                      }}
                    >
                      <Tooltip color="secondary" title="gross monthly income">
                        {employment?.gross_monthly_income}
                      </Tooltip>
                    </Typography>
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
                        icon={<GradeRounded color="primary" />}
                        label={
                          <Typography sx={{ textTransform: "lowercase" }}>
                            {employment.job_level_position}
                          </Typography>
                        }
                        actual="job level position"
                      />
                      <Chiptip
                        icon={<BusinessRounded color="primary" />}
                        label={
                          <Typography sx={{ textTransform: "lowercase" }}>
                            {employment.type_of_employer}
                          </Typography>
                        }
                        actual="employer type"
                      />
                      <Chiptip
                        icon={<PublicRounded color="primary" />}
                        label={
                          <Typography sx={{ textTransform: "lowercase" }}>
                            {employment.location_of_employment}
                          </Typography>
                        }
                        actual="employment location"
                      />
                    </Box>
                    <Box>
                      <Button
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: "1rem",
                          right: "1rem",
                        }}
                      >
                        <MoreHoriz color="primary" />
                      </Button>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={handleClose}>
                          <ListItemIcon>
                            <Edit fontSize="small" />
                          </ListItemIcon>
                          edit
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <ListItemIcon>
                            <DeleteForever fontSize="small" />
                          </ListItemIcon>
                          delete
                        </MenuItem>
                      </Menu>
                    </Box>
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
              <AddCircleRounded />
            </Fab>
          </Grid>
        )
      );
    }
  }
};
export default UpdateProfileContent;
