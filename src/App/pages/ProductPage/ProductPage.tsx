import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getProductByDocumentId } from '@/api/products'
import type { ProductEntity } from '@/types/product'

import styles from './ProductPage.module.scss'

const ProductPage = () => {
  const { documentId } = useParams()
  const [product, setProduct] = useState<ProductEntity | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async (): Promise<void> => {
      if (!documentId) {
        setError('Товар не найден')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError('')
        const result = await getProductByDocumentId(documentId)

        if (!result) {
          setError('Товар не найден')
          return
        }

        setProduct(result)
      } catch {
        setError('Не удалось получить товар')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProduct()
  }, [documentId])

  if (isLoading) {
    return <p className={styles.state}>Loading...</p>
  }

  if (error || !product) {
    return <p className={styles.state}>{error || 'Товар не найден'}</p>
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
        </div>
      </div>
    </section>
  )
}

export default ProductPage
