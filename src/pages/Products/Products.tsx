import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { Option } from '@/components/MultiDropdown/MultiDropdown'
import MultiDropdown from '@/components/MultiDropdown/MultiDropdown'
import ProductItem from '@/pages/Products/components/ProductItem'
import ProductSkeleton from '@/pages/Products/components/ProductSkeleton'
import ProductsPagination from '@/pages/Products/components/ProductsPagination'
import CategoriesStore from '@/store/CategoriesStore'
import ProductsStore from '@/store/ProductsStore'
import { Meta } from '@/utils/meta'
import { useLocalStore } from '@/utils/useLocalStore'

import styles from './Products.module.scss'

type PaginationItem = number | 'dots-left' | 'dots-right'

const PAGE_SIZE = 9

const getPaginationItems = (currentPage: number, totalPages: number): PaginationItem[] => {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 'dots-right', totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'dots-left', totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, 'dots-left', currentPage, 'dots-right', totalPages]
}

const Products = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams()

  const productsStore = useLocalStore(
    () =>
      new ProductsStore({
        search: searchParams.get('search') || undefined,
        page: Number(searchParams.get('page')) || undefined,
        categoryId: Number(searchParams.get('categoryId')) || undefined,
        categoryTitle: searchParams.get('category') || undefined,
      }),
  )

  const categoriesStore = useLocalStore(() => new CategoriesStore())

  useEffect(() => {
    categoriesStore.fetchCategories()
  }, [categoriesStore])

  // Sync store state to URL query params
  useEffect(() => {
    const params = new URLSearchParams()

    if (productsStore.search) {
      params.set('search', productsStore.search)
    }
    if (productsStore.selectedCategory) {
      params.set('category', productsStore.selectedCategory.title)
      params.set('categoryId', String(productsStore.selectedCategory.id))
    }
    if (productsStore.page > 1) {
      params.set('page', String(productsStore.page))
    }

    setSearchParams(params, { replace: true })
  }, [productsStore.search, productsStore.selectedCategory, productsStore.page, setSearchParams])

  const categoryOptions: Option[] = useMemo(
    () =>
      categoriesStore.categories.map((cat) => ({
        key: String(cat.id),
        value: cat.title,
      })),
    [categoriesStore.categories],
  )

  const selectedCategoryOptions: Option[] = useMemo(() => {
    if (!productsStore.selectedCategory) {
      return []
    }
    return [
      {
        key: String(productsStore.selectedCategory.id),
        value: productsStore.selectedCategory.title,
      },
    ]
  }, [productsStore.selectedCategory])

  const handleCategoryChange = (selected: Option[]) => {
    if (selected.length === 0) {
      productsStore.setSelectedCategory(null)
      return
    }
    // Use last selected for single-category filter
    const last = selected[selected.length - 1]
    const category = categoriesStore.categories.find((c) => String(c.id) === last.key)
    if (category) {
      productsStore.setSelectedCategory(category)
    }
  }

  const paginationItems = useMemo(
    () => getPaginationItems(productsStore.page, productsStore.totalPages),
    [productsStore.page, productsStore.totalPages],
  )

  const isLoading = productsStore.meta === Meta.loading
  const isError = productsStore.meta === Meta.error
  const isInitial = productsStore.meta === Meta.initial

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.subtitle}>
          We display products based on the latest products we have, if you want to see our old
          products please enter the name of the item.
        </p>
      </div>

      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          onChange={(event) => productsStore.setSearch(event.target.value)}
          placeholder="Search product"
          type="text"
          value={productsStore.search}
        />
        <button
          className={styles.findButton}
          onClick={() => productsStore.fetchProducts()}
          type="button"
        >
          Find now
        </button>
      </div>

      <div className={styles.filterRow}>
        <MultiDropdown
          disabled={categoriesStore.meta === Meta.loading}
          getTitle={(selected) =>
            selected.length > 0 ? selected.map((s) => s.value).join(', ') : 'Filter by category'
          }
          onChange={handleCategoryChange}
          options={categoryOptions}
          value={selectedCategoryOptions}
        />
      </div>

      <div className={styles.meta}>
        <span>Total products</span>
        <span className={styles.total}>{productsStore.totalProducts}</span>
      </div>

      {isError && <p className={styles.state}>Failed to load products</p>}

      {(isLoading || isInitial) && (
        <div className={styles.grid}>
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && !isError && !isInitial && (
        <>
          {productsStore.products.length === 0 ? (
            <p className={styles.state}>No products found</p>
          ) : (
            <div className={styles.grid}>
              {productsStore.products.map((product) => (
                <ProductItem key={product.documentId} product={product} />
              ))}
            </div>
          )}

          {productsStore.totalPages > 1 && (
            <ProductsPagination
              currentPage={productsStore.page}
              onNext={() => productsStore.setPage(Math.min(productsStore.totalPages, productsStore.page + 1))}
              onPageChange={(page) => productsStore.setPage(page)}
              onPrevious={() => productsStore.setPage(Math.max(1, productsStore.page - 1))}
              paginationItems={paginationItems}
              totalPages={productsStore.totalPages}
            />
          )}
        </>
      )}
    </section>
  )
})

export default Products
