import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'

import { useCartStore } from '@/store/CartStoreContext'
import type { ProductEntity } from '@/types/product'

import styles from './ProductItem.module.scss'

type ProductItemProps = {
  product: ProductEntity
}

const ProductItem = observer(({ product }: ProductItemProps) => {
  const cartStore = useCartStore()
  const inCart = cartStore.isInCart(product.id)

  const handleCartClick = () => {
    if (inCart) {
      cartStore.removeFromCart(product.id)
    } else {
      cartStore.addToCart(product)
    }
  }

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
          <button
            className={`${styles.addButton} ${inCart ? styles.addButtonInCart : ''}`}
            onClick={handleCartClick}
            type="button"
          >
            {inCart ? 'In cart' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  )
})

export default ProductItem
