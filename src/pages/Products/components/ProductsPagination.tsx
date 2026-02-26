import styles from '../Products.module.scss'

type PaginationItem = number | 'dots-left' | 'dots-right'

type ProductsPaginationProps = {
  currentPage: number
  totalPages: number
  paginationItems: PaginationItem[]
  onPageChange: (page: number) => void
  onPrevious: () => void
  onNext: () => void
}

function ProductsPagination({
  currentPage,
  totalPages,
  paginationItems,
  onPageChange,
  onPrevious,
  onNext,
}: ProductsPaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <nav aria-label="Products pagination" className={styles.pagination}>
      <button
        className={styles.pageArrow}
        disabled={currentPage === 1}
        onClick={onPrevious}
        type="button"
      >
        &lt;
      </button>
      {paginationItems.map((item) =>
        typeof item === 'number' ? (
          <button
            className={`${styles.pageButton} ${item === currentPage ? styles.pageButtonActive : ''}`}
            key={item}
            onClick={() => onPageChange(item)}
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
        onClick={onNext}
        type="button"
      >
        &gt;
      </button>
    </nav>
  )
}

export default ProductsPagination
