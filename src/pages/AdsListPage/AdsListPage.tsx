import { useQuery } from '@tanstack/react-query';
import { Container, Typography, Stack, Card, CardContent} from '@mui/material';
import { adApi } from '../../shared/api/adApi';
import PageLoader from '../../shared/ui/PageLoader';
import ErrorState from '../../shared/ui/ErrorState';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function AdsListPage() {
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  type Option = {
      label: string;
      value: string;
    };

  const getSortParams = (sortValue: Option['value']) => {
    switch (sortValue) {
      case 'newest':
        return { sortColumn: 'createdAt' as const, sortDirection: 'desc' as const };
      case 'oldest':
        return { sortColumn: 'createdAt' as const, sortDirection: 'asc' as const };
      case 'name_az':
        return { sortColumn: 'title' as const, sortDirection: 'asc' as const };
      case 'name_za':
        return { sortColumn: 'title' as const, sortDirection: 'desc' as const };
      default:
        return {};
    }
  };

    const options: Option[] = [
      { label: 'По новизне (сначала новые)', value: 'newest' },
      { label: 'По новизне (сначала старые)', value: 'oldest' },
      { label: 'По цене (сначала дешевле)', value: 'cheap' },
      { label: 'По цене (сначала дороже)', value: 'expensive' },
      { label: 'По названию (А-Я)', value: 'name_az' },
      { label: 'По названию (Я-А)', value: 'name_za' },
    ];
  const [selected, setSelected] = useState<Option>(options[0]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const sortParams = getSortParams(selected.value);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['ads', search, selected.value],
    queryFn: () =>
      adApi.getAds({
        limit: 1000,
        skip: 0,
        q: search || undefined,
        ...sortParams,
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

  const announcementEndWord =
    Math.abs(data?.total ?? 0) % 10 === 1 && (data?.total ?? 0) !== 11 ? 'е' :
    Math.abs(data?.total ?? 0) % 10 === 2 || 
    Math.abs(data?.total ?? 0) % 10 === 3 || 
    Math.abs(data?.total ?? 0) % 10 === 4 ? 'я' :
    'й';

  const handleSelect = (option: Option) => {
    if (option.value === 'cheap' || option.value === 'expensive') {
      setIsOpen(false);
      return;
    }

    setSelected(option);
    setIsOpen(false);
  };

 const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setSearch(searchInput.trim());
};



  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" mb={3}>
        Мои объявления 
      </Typography>
      <Typography variant="body1" mb={3}>
        {data?.total ?? 0} объявлени{announcementEndWord}
      </Typography>
      <div>

        <form onSubmit={handleSearchSubmit}>
          <input 
            type="search"
            placeholder="Найти объявление..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        <div>
          <button>Сетка</button>
          <button>Список</button>
        </div>

         <div>
      <button type="button" onClick={() => setIsOpen((prev) => !prev)}>
        {selected.label}
      </button>

      {isOpen && (
        <ul>
          {options.map((option) => (
            <li key={option.value}>
              <button type="button" onClick={() => handleSelect(option)}>
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
      </div>
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