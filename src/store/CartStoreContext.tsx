import { createContext, useContext, type ReactNode } from 'react'

import { useLocalStore } from '@/utils/useLocalStore'

import CartStore from './CartStore'

const CartStoreContext = createContext<CartStore | null>(null)

type CartStoreProviderProps = {
  children: ReactNode
}

export const CartStoreProvider = ({ children }: CartStoreProviderProps) => {
  const store = useLocalStore(() => new CartStore())

  return (
    <CartStoreContext.Provider value={store}>
      {children}
    </CartStoreContext.Provider>
  )
}

export const useCartStore = (): CartStore => {
  const store = useContext(CartStoreContext)
  if (!store) {
    throw new Error('useCartStore must be used within CartStoreProvider')
  }
  return store
}
