import { Link } from 'react-router-dom'

import type { ProductEntity } from '@/types/product'

import styles from './ProductItem.module.scss'

type ProductItemProps = {
  product: ProductEntity
}

const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <article className={styles.card}>
      <Link aria-label={product.title} className={styles.imageLink} to={`/products/${product.documentId}`}>
        {product.imageUrl ? (
          <img alt={product.title} className={styles.image} src={product.imageUrl} />
        ) : (
          <div className={styles.image} />
        )}
      </Link>
      <div className={styles.content}>
        <span className={styles.category}>{product.category}</span>
        <Link className={styles.titleLink} to={`/products/${product.documentId}`}>
          {product.title}
        </Link>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <button className={styles.addButton} type="button">
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductItem
