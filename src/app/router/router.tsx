import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AdsListPage } from '../../pages/AdsListPage/AdsListPage';
import { AdDetailsPage } from '../../pages/AdDetailsPage/AdDetailsPage';
import { AdEditPage } from '../../pages/AdEditPage/AdEditPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/ads" replace />,
  },
  {
    path: '/ads',
    element: <AdsListPage />,
  },
  {
    path: '/ads/:id',
    element: <AdDetailsPage />,
  },
  {
    path: '/ads/:id/edit',
    element: <AdEditPage />,
  },
]);