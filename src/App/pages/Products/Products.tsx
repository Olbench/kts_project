import { useEffect, useMemo, useState } from 'react'

import { getProducts } from '@/api/products'
import ProductItem from '@/App/pages/Products/components/ProductItem'
import type { ProductEntity } from '@/types/product'

import styles from './Products.module.scss'

const EMPTY_TOTAL = 0
const PAGE_SIZE = 9

type PaginationItem = number | 'dots-left' | 'dots-right'

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

function Products() {
  const [products, setProducts] = useState<ProductEntity[]>([])
  const [total, setTotal] = useState<number>(EMPTY_TOTAL)
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        setIsLoading(true)
        setError('')
        const result = await getProducts()
        setProducts(result.products)
        setTotal(result.total)
      } catch {
        setError('Не удалось получить товары')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProducts()
  }, [])

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        product.title.toLowerCase().includes(searchValue.toLowerCase().trim()),
      ),
    [products, searchValue],
  )

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const visibleProducts = useMemo(() => {
    const offset = (currentPage - 1) * PAGE_SIZE
    return filteredProducts.slice(offset, offset + PAGE_SIZE)
  }, [currentPage, filteredProducts])
  const paginationItems = useMemo(
    () => getPaginationItems(currentPage, totalPages),
    [currentPage, totalPages],
  )

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

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
          onChange={(event) => {
            setSearchValue(event.target.value)
            setCurrentPage(1)
          }}
          placeholder="Search product"
          type="text"
          value={searchValue}
        />
        <button className={styles.findButton} type="button">
          Find now
        </button>
      </div>

      <div className={styles.meta}>
        <span>Total products</span>
        <span className={styles.total}>{total}</span>
      </div>

      {isLoading && <p className={styles.state}>Loading...</p>}
      {error && <p className={styles.state}>{error}</p>}
      {!isLoading && !error && (
        <>
          <div className={styles.grid}>
            {visibleProducts.map((product) => (
              <ProductItem key={product.documentId} product={product} />
            ))}
          </div>
          {filteredProducts.length > PAGE_SIZE && (
            <nav aria-label="Products pagination" className={styles.pagination}>
              <button
                className={styles.pageArrow}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                type="button"
              >
                &lt;
              </button>
              {paginationItems.map((item) =>
                typeof item === 'number' ? (
                  <button
                    className={`${styles.pageButton} ${item === currentPage ? styles.pageButtonActive : ''}`}
                    key={item}
                    onClick={() => setCurrentPage(item)}
                    type="button"
                  >
                    {item}
                  </button>
                ) : (
                  <span className={styles.pageDots} key={item}>
                    ...
                  </span>
                ),
              )}
              <button
                className={styles.pageArrow}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                type="button"
              >
                &gt;
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  )
}

export default Products
