import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { adApi } from '../../shared/api/adApi'
import type { Ad } from '../../shared/types/ad'
import { CircularProgress, Typography, Box, Card, CardContent, Badge, Button } from '@mui/material'

export function AdDetailsPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const [ad, setAd] = useState<Ad | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

 useEffect(() => {
  if (!id) return
  adApi.getAdById(id)
    .then(data => setAd(data))
    .catch(err => setError(err.message))
    .finally(() => setLoading(false))
}, [id])

  if (loading) return <CircularProgress />
  if (error) return <Typography color="error">Ошибка: {error}</Typography>
  if (!ad) return <Typography>Объявление не найдено</Typography>

  return (
    <Box>
      <Button onClick={() => navigate('/ads')} sx={{ mb: 2 }}>
        Назад
      </Button>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Typography variant="h4">{ad.title}</Typography>
              <button
                onClick={() => navigate(`/ads/${ad.id}/edit`)}
              >Редактировать</button>
            </div>
            <div>  
              <Typography variant="body1">Цена: {ad.price} ₽</Typography> 
              <Typography variant="body2">
                Дата создания: {ad.createdAt ? new Date(ad.createdAt).toLocaleString() : '-'}
              </Typography>
              <Typography variant="body2">
                Дата обновления: {ad.updatedAt ? new Date(ad.updatedAt).toLocaleString() : '-'}
              </Typography>
            </div>
          </header>    
          
          {ad.description && <Typography mt={1}>{ad.description}</Typography>}
          {ad.needsRevision && <Badge color="warning">Требует доработок</Badge>}
          <Typography variant="subtitle1">Категория {ad.category}</Typography>
          <Box mt={2}>
            <Typography variant="h6">Характеристики:</Typography>
            
            <ul>
              {Object.entries(ad.params).map(([key, value]) => (
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