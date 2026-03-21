import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { adApi } from '../../shared/api/adApi'
import type { Ad } from '../../shared/types/ad'
import { CircularProgress, Typography, Box, Card, CardContent, Badge, Button } from '@mui/material'

export function AdDetailsPage() {
  // Получаем id из URL
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<Ad | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

 useEffect(() => {
  if (!id) return
  adApi.getAdById(id)
    .then(data => setItem(data))
    .catch(err => setError(err.message))
    .finally(() => setLoading(false))
}, [id])

  if (loading) return <CircularProgress />
  if (error) return <Typography color="error">Ошибка: {error}</Typography>
  if (!item) return <Typography>Объявление не найдено</Typography>

  return (
    <Box>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Назад
      </Button>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h4">{item.title}</Typography>
          <Typography variant="subtitle1">Категория: {item.category}</Typography>
          <Typography variant="body1">Цена: {item.price} ₽</Typography>
          {item.description && <Typography mt={1}>{item.description}</Typography>}
          {item.needsRevision && <Badge color="warning">Требует доработок</Badge>}
          <Typography variant="body2">
            Дата создания: {item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}
          </Typography>
          <Typography variant="body2">
            Дата обновления: {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-'}
          </Typography>

          <Box mt={2}>
            <Typography variant="h6">Параметры:</Typography>
            <ul>
              {Object.entries(item.params).map(([key, value]) => (
                <li key={key}>
                  {key}: {String(value)}
                </li>
              ))}
            </ul>
          </Box>

        </CardContent>
      </Card>
    </Box>
  )
}