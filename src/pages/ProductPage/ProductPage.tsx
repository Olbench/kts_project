import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import Loader from '@/components/Loader'
import { useCartStore } from '@/store/CartStoreContext'
import SingleProductStore from '@/store/SingleProductStore'
import { Meta } from '@/utils/meta'
import { useLocalStore } from '@/utils/useLocalStore'

import styles from './ProductPage.module.scss'

const ProductPage = observer(() => {
  const { documentId } = useParams()
  const productStore = useLocalStore(() => new SingleProductStore())
  const cartStore = useCartStore()

  useEffect(() => {
    if (documentId) {
      productStore.fetchProduct(documentId)
    }
  }, [documentId, productStore])

  if (productStore.isLoading) {
    return (
      <div className={styles.state}>
        <Loader size="l" />
      </div>
    )
  }

  if (productStore.meta === Meta.error || !productStore.product) {
    return <p className={styles.state}>Product not found</p>
  }

  const product = productStore.product
  const quantityInCart = cartStore.getProductQuantity(product.id)
  const inCart = quantityInCart > 0

  const handleAdd = () => {
    cartStore.addToCart(product, 1)
  }

  const handleDecrease = () => {
    cartStore.removeFromCart(product.id, 1)
  }

  return (
    <section className={styles.page}>
      <Link className={styles.backLink} to="/products">
        Back to products
      </Link>
      <div className={styles.content}>
        {product.imageUrl ? (
          <img alt={product.title} className={styles.image} src={product.imageUrl} />
        ) : (
          <div className={styles.image} />
        )}
        <div className={styles.info}>
          <p className={styles.category}>{product.category}</p>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.description}>{product.description}</p>
          <p className={styles.price}>${product.price.toFixed(2)}</p>
          {inCart ? (
            <div className={styles.quantityControl}>
              <button className={styles.quantityButton} onClick={handleDecrease} type="button">
                -
              </button>
              <span className={styles.quantityValue}>{quantityInCart}</span>
              <button className={styles.quantityButton} onClick={handleAdd} type="button">
                +
              </button>
            </div>
          ) : (
            <button className={styles.cartButton} onClick={handleAdd} type="button">
              Add to cart
            </button>
          )}
        </div>
      </div>
    </section>
  )
})

export default ProductPage
