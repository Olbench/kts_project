import { useEffect, useRef } from 'react'

export interface ILocalStore {
  destroy(): void
}

export const useLocalStore = <T extends ILocalStore>(creator: () => T): T => {
  const storeRef = useRef<T | null>(null)

  if (storeRef.current === null) {
    storeRef.current = creator()
  }

  useEffect(() => {
    return () => {
      storeRef.current?.destroy()
    }
  }, [])

  return storeRef.current
}
