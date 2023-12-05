import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'

function LoadingCircular({baseHeight}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={baseHeight || "90vh"}
      bgcolor={(theme) => theme.palette.secondary.main}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}

export default LoadingCircular