import { Badge, Card, CardContent, Typography } from '@mui/material'
import type { Ad } from '../../shared/types/ad'

// Type for list items (limited properties from API)
type ListItem = {
	id: number
	category: Ad['category']
	title: string
	price: number
	needsRevision: boolean
}

interface AdCardProps {
	item: ListItem
	onClick?: () => void
}

export function AdCard({ item, onClick }: AdCardProps) {
	return (
		<Card
			onClick={onClick}
			sx={{ cursor: 'pointer', mb: 2 }}
		>
			<CardContent>
				<Typography variant="h6">{item.title}</Typography>
				<Typography>{item.category}</Typography>
				<Typography>{item.price} ₽</Typography>
				{item.needsRevision && <Badge color="warning">Требует доработок</Badge>}
			</CardContent>
		</Card>
	)
}
