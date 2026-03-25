import { Box, CircularProgress } from '@mui/material';

export default function PageLoader() {
  return (
    <Box
      sx={{
        minHeight: '40vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress sx={{ color: 'rgb(56, 161, 100)' }} />
    </Box>
  );
}