import '@/config/configureMobX'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { routesConfig } from '@/config/routes'
import { CartStoreProvider } from '@/store/CartStoreContext'

import './index.css'

const router = createBrowserRouter(routesConfig)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartStoreProvider>
      <RouterProvider router={router} />
    </CartStoreProvider>
  </StrictMode>,
)
