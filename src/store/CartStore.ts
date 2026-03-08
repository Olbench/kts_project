import {
  action,
  computed,
  type IReactionDisposer,
  makeObservable,
  observable,
  reaction,
} from 'mobx'

import {
  addCartProduct,
  getCartItems,
  removeCartProduct,
} from '@/api/cart'
import {
  type CollectionModel,
  getInitialCollectionModel,
  linearizeCollection,
  normalizeCollection,
} from '@/models/shared/collection'
import type { ProductEntity } from '@/types/product'

type PrivateFields = '_items'

const CART_STORAGE_KEY = 'cart_items'

type CartLine = {
  product: ProductEntity
  quantity: number
}

type PersistedCartLine = {
  product: ProductEntity
  quantity: number
}

export default class CartStore {
  private _items: CollectionModel<number, CartLine> = getInitialCollectionModel()
  private _persistReactionDisposer: IReactionDisposer | null = null

  constructor() {
    makeObservable<CartStore, PrivateFields>(this, {
      _items: observable.ref,
      cartItems: computed,
      items: computed,
      count: computed,
      totalPrice: computed,
      addToCart: action.bound,
      removeFromCart: action.bound,
      removeItemFromCart: action.bound,
      clearCart: action.bound,
    })

    this._restoreFromStorage()
    void this._restoreFromBackend()

    this._persistReactionDisposer = reaction(
      () => this._items,
      (items) => {
        try {
          const data = linearizeCollection(items).map((line) => ({
            product: line.product,
            quantity: line.quantity,
          }))
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data))
        } catch {
          // localStorage might be unavailable
        }
      },
    )
  }

  get cartItems(): CartLine[] {
    return linearizeCollection(this._items)
  }

  get items(): ProductEntity[] {
    return this.cartItems.map((line) => line.product)
  }

  get count(): number {
    return this.cartItems.reduce((sum, line) => sum + line.quantity, 0)
  }

  get totalPrice(): number {
    return this.cartItems.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
  }

  isInCart(productId: number): boolean {
    return this.getProductQuantity(productId) > 0
  }

  getProductQuantity(productId: number): number {
    const line = this._items.entities[productId]
    return line?.quantity ?? 0
  }

  addToCart(product: ProductEntity, quantity = 1): void {
    if (quantity <= 0) {
      return
    }

    const currentItems = this.cartItems
    const existing = currentItems.find((line) => line.product.id === product.id)

    if (!existing) {
      this._items = normalizeCollection(
        [...currentItems, { product, quantity }],
        (line) => line.product.id,
      )
    } else {
      this._items = normalizeCollection(
        currentItems.map((line) =>
          line.product.id === product.id
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        ),
        (line) => line.product.id,
      )
    }

    void this._syncAdd(product.id, quantity)
  }

  removeFromCart(productId: number, quantity = 1): void {
    if (quantity <= 0) {
      return
    }

    const currentItems = this.cartItems
    const existing = currentItems.find((line) => line.product.id === productId)

    if (!existing) {
      return
    }

    const nextQuantity = existing.quantity - quantity
    const nextItems = nextQuantity > 0
      ? currentItems.map((line) =>
          line.product.id === productId ? { ...line, quantity: nextQuantity } : line,
        )
      : currentItems.filter((line) => line.product.id !== productId)

    this._items = normalizeCollection(nextItems, (line) => line.product.id)
    void this._syncRemove(productId, quantity)
  }

  removeItemFromCart(productId: number): void {
    const currentItems = this.cartItems
    const existing = currentItems.find((line) => line.product.id === productId)

    if (!existing) {
      return
    }

    this._items = normalizeCollection(
      currentItems.filter((line) => line.product.id !== productId),
      (line) => line.product.id,
    )
    void this._syncRemove(productId, existing.quantity)
  }

  clearCart(): void {
    const lines = this.cartItems
    this._items = getInitialCollectionModel()
    void this._syncClear(lines)
  }

  private _restoreFromStorage(): void {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as PersistedCartLine[] | ProductEntity[]

        if (!Array.isArray(parsed) || parsed.length === 0) {
          return
        }

        const normalized = parsed
          .map((item) => {
            if ('product' in item) {
              return {
                product: item.product,
                quantity: Math.max(1, item.quantity || 1),
              }
            }
            return {
              product: item,
              quantity: 1,
            }
          })
          .filter((line) => line.product?.id)

        if (normalized.length > 0) {
          this._items = normalizeCollection(normalized, (line) => line.product.id)
        }
      }
    } catch {
      // Invalid data in storage, ignore
    }
  }

  private async _restoreFromBackend(): Promise<void> {
    try {
      const items = await getCartItems()
      this._items = normalizeCollection(
        items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        (line) => line.product.id,
      )
    } catch {
      // Keep local state if cart backend is unavailable
    }
  }

  private async _syncAdd(productId: number, quantity: number): Promise<void> {
    try {
      await addCartProduct({ product: productId, quantity })
    } catch {
      // Keep local state if cart backend is unavailable
    }
  }

  private async _syncRemove(productId: number, quantity: number): Promise<void> {
    try {
      await removeCartProduct({ product: productId, quantity })
    } catch {
      // Keep local state if cart backend is unavailable
    }
  }

  private async _syncClear(lines: CartLine[]): Promise<void> {
    try {
      await Promise.all(
        lines.map((line) =>
          removeCartProduct({ product: line.product.id, quantity: line.quantity }),
        ),
      )
    } catch {
      // Keep local state if cart backend is unavailable
    }
  }

  destroy(): void {
    if (this._persistReactionDisposer) {
      this._persistReactionDisposer()
    }
  }
}
