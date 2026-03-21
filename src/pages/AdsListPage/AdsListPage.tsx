import { useState } from 'react';
import { useAds } from './useAds';
import { AdCard } from '../../widgets/AdCard/AdCard';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function AdsListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useAds({ limit: 10, skip: (page - 1) * 10 });

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Ошибка загрузки</Typography>;

  return (
    <Box>
      <Typography variant="h4" mb={2}>Мои объявления ({data?.total})</Typography>
      {data?.items.map(item => (
        <AdCard
          key={item.id}
          item={item}
          onClick={() => navigate(`/ads/${item.id}`)}
        />
      ))}
      {/* Здесь можно добавить пагинацию */}
    </Box>
  );
}