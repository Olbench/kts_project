import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx'

import { getProducts } from '@/api/products'
import {
  type CollectionModel,
  getInitialCollectionModel,
  linearizeCollection,
  normalizeCollection,
} from '@/models/shared/collection'
import type { CategoryEntity, ProductEntity } from '@/types/product'
import { Meta } from '@/utils/meta'
import type { ILocalStore } from '@/utils/useLocalStore'

type PrivateFields = '_products' | '_meta' | '_search' | '_selectedCategory' | '_page' | '_totalProducts'

export type ProductsStoreInitParams = {
  search?: string
  categoryId?: number
  categoryTitle?: string
  page?: number
}

const PAGE_SIZE = 9
const SEARCH_DEBOUNCE_MS = 300

export default class ProductsStore implements ILocalStore {
  private _products: CollectionModel<number, ProductEntity> = getInitialCollectionModel()
  private _meta: Meta = Meta.initial
  private _search: string = ''
  private _selectedCategory: CategoryEntity | null = null
  private _page: number = 1
  private _totalProducts: number = 0

  private _searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

  constructor(params?: ProductsStoreInitParams) {
    makeObservable<ProductsStore, PrivateFields>(this, {
      _products: observable.ref,
      _meta: observable,
      _search: observable,
      _selectedCategory: observable.ref,
      _page: observable,
      _totalProducts: observable,
      products: computed,
      meta: computed,
      search: computed,
      selectedCategory: computed,
      page: computed,
      totalPages: computed,
      totalProducts: computed,
      setSearch: action.bound,
      setSelectedCategory: action.bound,
      setPage: action.bound,
      fetchProducts: action.bound,
    })

    if (params) {
      if (params.search) {
        this._search = params.search
      }
      if (params.page && params.page > 0) {
        this._page = params.page
      }
      if (params.categoryId && params.categoryTitle) {
        this._selectedCategory = {
          id: params.categoryId,
          documentId: '',
          title: params.categoryTitle,
        }
      }
    }

    this.fetchProducts()
  }

  get products(): ProductEntity[] {
    return linearizeCollection(this._products)
  }

  get meta(): Meta {
    return this._meta
  }

  get search(): string {
    return this._search
  }

  get selectedCategory(): CategoryEntity | null {
    return this._selectedCategory
  }

  get page(): number {
    return this._page
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this._totalProducts / PAGE_SIZE))
  }

  get totalProducts(): number {
    return this._totalProducts
  }

  setSearch(value: string): void {
    this._search = value

    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer)
    }

    this._searchDebounceTimer = setTimeout(() => {
      runInAction(() => {
        this._page = 1
      })
      this.fetchProducts()
    }, SEARCH_DEBOUNCE_MS)
  }

  setSelectedCategory(category: CategoryEntity | null): void {
    this._selectedCategory = category
    this._page = 1
    this.fetchProducts()
  }

  setPage(page: number): void {
    this._page = page
    this.fetchProducts()
  }

  async fetchProducts(): Promise<void> {
    this._meta = Meta.loading

    try {
      const result = await getProducts({
        page: this._page,
        pageSize: PAGE_SIZE,
        search: this._search || undefined,
        categoryId: this._selectedCategory?.id,
      })

      runInAction(() => {
        this._products = normalizeCollection(result.products, (p) => p.id)
        this._totalProducts = result.total
        this._meta = Meta.success
      })
    } catch {
      runInAction(() => {
        this._meta = Meta.error
      })
    }
  }

  destroy(): void {
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer)
    }
  }
}
