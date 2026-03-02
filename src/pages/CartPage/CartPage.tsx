import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'

import { useCartStore } from '@/store/CartStoreContext'

import styles from './CartPage.module.scss'

const CartPage = observer(() => {
  const cartStore = useCartStore()

  return (
    <section className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Cart</h1>
        <Link className={styles.shopLink} to="/products">
          Continue shopping
        </Link>
      </div>

      {cartStore.count === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Your cart is empty</p>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.items}>
            {cartStore.cartItems.map(({ product, quantity }) => (
              <div className={styles.item} key={product.id}>
                <Link className={styles.itemImageLink} to={`/products/${product.documentId}`}>
                  {product.imageUrl ? (
                    <img alt={product.title} className={styles.itemImage} src={product.imageUrl} />
                  ) : (
                    <div className={styles.itemImage} />
                  )}
                </Link>
                <div className={styles.itemInfo}>
                  <div className={styles.itemTop}>
                    <div className={styles.itemMeta}>
                      <Link className={styles.itemTitle} to={`/products/${product.documentId}`}>
                        {product.title}
                      </Link>
                      <span className={styles.itemCategory}>{product.category}</span>
                    </div>
                    <div className={styles.itemActions}>
                      <span className={styles.itemCount}>Qty: {quantity}</span>
                      <button
                        aria-label="Remove item"
                        className={styles.removeButton}
                        onClick={() => cartStore.removeItemFromCart(product.id)}
                        type="button"
                      >
                        x
                      </button>
                    </div>
                  </div>

                  <div className={styles.itemBottom}>
                    <div className={styles.quantityControl}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => cartStore.removeFromCart(product.id, 1)}
                        type="button"
                      >
                        -
                      </button>
                      <span className={styles.quantityValue}>{quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => cartStore.addToCart(product, 1)}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                    <span className={styles.itemPrice}>
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className={styles.summary}>
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
          </aside>
        </div>
      )}
    </section>
  )
})

export default CartPage
