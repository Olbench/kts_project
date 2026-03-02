import {
  action,
  computed,
  type IReactionDisposer,
  makeObservable,
  observable,
  reaction,
} from 'mobx'

import {
  type CollectionModel,
  getInitialCollectionModel,
  linearizeCollection,
  normalizeCollection,
} from '@/models/shared/collection'
import type { ProductEntity } from '@/types/product'

type PrivateFields = '_items'

const CART_STORAGE_KEY = 'cart_items'

export default class CartStore {
  private _items: CollectionModel<number, ProductEntity> = getInitialCollectionModel()
  private _persistReactionDisposer: IReactionDisposer | null = null

  constructor() {
    makeObservable<CartStore, PrivateFields>(this, {
      _items: observable.ref,
      items: computed,
      count: computed,
      totalPrice: computed,
      addToCart: action.bound,
      removeFromCart: action.bound,
      clearCart: action.bound,
    })

    this._restoreFromStorage()

    this._persistReactionDisposer = reaction(
      () => this._items,
      (items) => {
        try {
          const data = linearizeCollection(items)
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data))
        } catch {
          // localStorage might be unavailable
        }
      },
    )
  }

  get items(): ProductEntity[] {
    return linearizeCollection(this._items)
  }

  get count(): number {
    return this._items.order.length
  }

  get totalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0)
  }

  isInCart(productId: number): boolean {
    return this._items.order.includes(productId)
  }

  addToCart(product: ProductEntity): void {
    if (this.isInCart(product.id)) {
      return
    }

    const currentItems = linearizeCollection(this._items)
    this._items = normalizeCollection([...currentItems, product], (p) => p.id)
  }

  removeFromCart(productId: number): void {
    const currentItems = linearizeCollection(this._items)
    const filtered = currentItems.filter((item) => item.id !== productId)
    this._items = normalizeCollection(filtered, (p) => p.id)
  }

  clearCart(): void {
    this._items = getInitialCollectionModel()
  }

  private _restoreFromStorage(): void {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as ProductEntity[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          this._items = normalizeCollection(parsed, (p) => p.id)
        }
      }
    } catch {
      // Invalid data in storage, ignore
    }
  }

  destroy(): void {
    if (this._persistReactionDisposer) {
      this._persistReactionDisposer()
    }
  }
}
