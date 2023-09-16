import { BeachAccess, Image, Work } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";

function Rightbar() {
  return (
    <Box flex={2} p={2} sx={{ display: { xs: "none", sm: "block" } }}>
      <Box
        position="fixed"
        sx={{
          maxWidth: "30%",
          display: "flex",
          gap: 3,
          flexDirection: "column",
        }}
      >
        <Card variant="outlined">
          <CardContent
            sx={{ display: "flex", alignItems: "center", gap: 1, padding: 2 }}
          >
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{ textAlign: "center" }}
            >
              personal engagement metrics
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent
            py={3}
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{ textAlign: "center" }}
            >
              top contributors
            </Typography>
            <Box>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src="https://static.voguescandinavia.com/Laufey_press_photos_album_release_3_PC_Gemma_Warren_jpeg_495be45c04/Laufey_press_photos_album_release_3_PC_Gemma_Warren_jpeg_495be45c04.jpeg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        rose anne loyola
                      </Typography>
                    }
                    secondary="yourowaimutusan@gmail.com"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src="https://ucarecdn.com/c0549749-795b-4ae3-802c-3dfc275aa0b4/-/crop/1190x1000/5,0/-/resize/1035x870/" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        majoy balancio
                      </Typography>
                    }
                    secondary="mjbalancio@gmail.com"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src="https://www.rollingstone.com/wp-content/uploads/2021/04/Laufey_Photos_Press-Photo_Film-3-PC_-Blythe-Thomasc.jpg?w=1024" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        jayson tabuelog
                      </Typography>
                    }
                    secondary="jaysontabulog@gmail.com"
                  />
                </ListItem>
              </List>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Rightbar;
