import { Navigate, type RouteObject } from 'react-router-dom'

import App from '@/App'
import ErrorPage from '@/pages/ErrorPage'
import CartPage from '@/pages/CartPage'
import PlaceholderPage from '@/pages/PlaceholderPage'
import ProductPage from '@/pages/ProductPage'
import Products from '@/pages/Products'

export const routesConfig: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/products" replace />,
      },
      {
        path: 'products',
        element: <Products />,
      },
      {
        path: 'products/:documentId',
        element: <ProductPage />,
      },
      {
        path: 'categories',
        element: <PlaceholderPage title="Categories" />,
      },
      {
        path: 'about-us',
        element: <PlaceholderPage title="About us" />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'user-profile',
        element: <PlaceholderPage title="User profile" />,
      },
    ],
  },
]
