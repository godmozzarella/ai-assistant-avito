import { Alert, Box } from '@mui/material';

type ErrorStateProps = {
  message?: string;
};

export default function ErrorState({
  message = 'Что-то пошло не так',
}: ErrorStateProps) {
  return (
    <Box sx={{ mt: 3 }}>
      <Alert severity="error">{message}</Alert>
    </Box>
  );
}