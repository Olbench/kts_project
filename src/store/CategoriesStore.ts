import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx'

import { getCategories } from '@/api/categories'
import type { CategoryEntity } from '@/types/product'
import { Meta } from '@/utils/meta'
import type { ILocalStore } from '@/utils/useLocalStore'

type PrivateFields = '_categories' | '_meta'

export default class CategoriesStore implements ILocalStore {
  private _categories: CategoryEntity[] = []
  private _meta: Meta = Meta.initial

  constructor() {
    makeObservable<CategoriesStore, PrivateFields>(this, {
      _categories: observable.ref,
      _meta: observable,
      categories: computed,
      meta: computed,
      fetchCategories: action.bound,
    })
  }

  get categories(): CategoryEntity[] {
    return this._categories
  }

  get meta(): Meta {
    return this._meta
  }

  async fetchCategories(): Promise<void> {
    this._meta = Meta.loading

    try {
      const categories = await getCategories()

      runInAction(() => {
        this._categories = categories
        this._meta = Meta.success
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
