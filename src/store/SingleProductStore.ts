import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx'

import { getProductByDocumentId } from '@/api/products'
import type { ProductEntity } from '@/types/product'
import { Meta } from '@/utils/meta'
import type { ILocalStore } from '@/utils/useLocalStore'

type PrivateFields = '_product' | '_meta'

export default class SingleProductStore implements ILocalStore {
  private _product: ProductEntity | null = null
  private _meta: Meta = Meta.initial

  constructor() {
    makeObservable<SingleProductStore, PrivateFields>(this, {
      _product: observable.ref,
      _meta: observable,
      product: computed,
      meta: computed,
      isLoading: computed,
      fetchProduct: action.bound,
    })
  }

  get product(): ProductEntity | null {
    return this._product
  }

  get meta(): Meta {
    return this._meta
  }

  get isLoading(): boolean {
    return this._meta === Meta.loading || this._meta === Meta.initial
  }

  async fetchProduct(documentId: string): Promise<void> {
    this._meta = Meta.loading

    try {
      const product = await getProductByDocumentId(documentId)

      runInAction(() => {
        this._product = product
        this._meta = product ? Meta.success : Meta.error
      })
    } catch {
      runInAction(() => {
        this._meta = Meta.error
      })
    }
  }

  destroy(): void {
    // No reactions to dispose
  }
}
