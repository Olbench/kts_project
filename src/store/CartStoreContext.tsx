import { createContext, useContext, useRef, type ReactNode } from 'react'

import CartStore from './CartStore'

const CartStoreContext = createContext<CartStore | null>(null)

type CartStoreProviderProps = {
  children: ReactNode
}

export const CartStoreProvider = ({ children }: CartStoreProviderProps) => {
  const storeRef = useRef<CartStore | null>(null)

  if (storeRef.current === null) {
    storeRef.current = new CartStore()
  }

  return (
    <CartStoreContext.Provider value={storeRef.current}>
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
