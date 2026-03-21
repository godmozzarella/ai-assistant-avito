import { useQuery } from '@tanstack/react-query';
import { Container, Typography, Stack, Card, CardContent } from '@mui/material';
import { adApi } from '../../shared/api/adApi';
import PageLoader from '../../shared/ui/PageLoader';
import ErrorState from '../../shared/ui/ErrorState';
import { useNavigate } from 'react-router-dom';

export function AdsListPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['ads'],
    queryFn: () =>
      adApi.getAds({
        limit: 10,
        skip: 0,
      }),
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <Container>
        <ErrorState
          message={error instanceof Error ? error.message : 'Не удалось загрузить объявления'}
        />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" mb={3}>
        Мои объявления ({data?.total ?? 0})
      </Typography>

      <Stack spacing={2}>
        {data?.items.map((ad) => (
          <Card
            key={ad.id}
            onClick={() => navigate(`/ads/${ad.id}`)}
            sx={{ cursor: 'pointer' }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {ad.category}
              </Typography>

              <Typography variant="h6">{ad.title}</Typography>

              <Typography variant="body1">{ad.price} ₽</Typography>

              <Typography variant="body2">
                {ad.needsRevision ? 'Требует доработок' : 'Заполнено'}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}