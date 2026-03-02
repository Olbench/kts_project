import styles from './ProductSkeleton.module.scss'

const ProductSkeleton = () => {
  return (
    <div className={styles.card}>
      <div className={styles.image} />
      <div className={styles.content}>
        <div className={styles.category} />
        <div className={styles.title} />
        <div className={styles.description}>
          <div className={styles.line} />
          <div className={styles.line} />
          <div className={styles.lineShort} />
        </div>
        <div className={styles.footer}>
          <div className={styles.price} />
          <div className={styles.button} />
        </div>
      </div>
    </div>
  )
}

export default ProductSkeleton
