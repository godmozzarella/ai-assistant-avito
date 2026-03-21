import type { Item } from '../../shared/types/item';
import { Card, CardContent, Typography, Badge } from '@mui/material';

interface AdCardProps {
  item: Item;
  onClick?: () => void;
}

export function AdCard({ item, onClick }: AdCardProps) {
  return (
    <Card onClick={onClick} sx={{ cursor: 'pointer', mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{item.title}</Typography>
        <Typography>{item.category}</Typography>
        <Typography>{item.price} ₽</Typography>
        {item.needsRevision && <Badge color="warning">Требует доработок</Badge>}
      </CardContent>
    </Card>
  );
}