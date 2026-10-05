import { lazy } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router';
import { AppLayout } from './layouts/AppLayout';
import { ACCOUNT_ITEMS, NAV_ITEMS } from './nav';
import ComingSoon from './pages/ComingSoon';
import RouteError from './pages/RouteError';

const pages: RouteObject[] = [...NAV_ITEMS, ...ACCOUNT_ITEMS].map(({ path, page }) => {
  const Page = page ? lazy(page) : ComingSoon;
  return { path, element: <Page /> };
});

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [{ errorElement: <RouteError />, children: [...pages, { path: '*', element: <ComingSoon /> }] }],
  },
]);
