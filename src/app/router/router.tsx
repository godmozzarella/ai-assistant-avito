import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdDetailsPage } from '../../pages/AdDetailsPage/AdDetailsPage'
import { AdEditPage } from '../../pages/AdEditPage/AdEditPage'
import { AdsListPage } from '../../pages/AdsListPage/AdsListPage'

export const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<Navigate
				to="/ads"
				replace
			/>
		)
	},
	{
		path: '/ads',
		element: <AdsListPage />
	},
	{
		path: '/ads/:id',
		element: <AdDetailsPage />
	},
	{
		path: '/ads/:id/edit',
		element: <AdEditPage />
	}
])
