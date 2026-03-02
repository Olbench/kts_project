import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'

import { useCartStore } from '@/store/CartStoreContext'

import styles from './CartPage.module.scss'

const CartPage = observer(() => {
  const cartStore = useCartStore()

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Cart</h1>

      {cartStore.count === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Your cart is empty</p>
          <Link className={styles.shopLink} to="/products">
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.items}>
            {cartStore.items.map((item) => (
              <div className={styles.item} key={item.id}>
                <Link className={styles.itemImageLink} to={`/products/${item.documentId}`}>
                  {item.imageUrl ? (
                    <img alt={item.title} className={styles.itemImage} src={item.imageUrl} />
                  ) : (
                    <div className={styles.itemImage} />
                  )}
                </Link>
                <div className={styles.itemInfo}>
                  <Link className={styles.itemTitle} to={`/products/${item.documentId}`}>
                    {item.title}
                  </Link>
                  <span className={styles.itemCategory}>{item.category}</span>
                  <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => cartStore.removeFromCart(item.id)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Items:</span>
              <span>{cartStore.count}</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total:</span>
              <span>${cartStore.totalPrice.toFixed(2)}</span>
            </div>
            <button
              className={styles.clearButton}
              onClick={() => cartStore.clearCart()}
              type="button"
            >
              Clear cart
            </button>
          </div>
        </>
      )}
    </section>
  )
})

export default CartPage
