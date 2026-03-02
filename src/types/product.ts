export type ProductEntity = {
  id: number
  documentId: string
  title: string
  description: string
  price: number
  discountPercent: number
  rating: number
  isInStock: boolean
  category: string
  categoryId: number
  imageUrl: string
}

export type ProductsListResult = {
  products: ProductEntity[]
  total: number
}

export type CategoryEntity = {
  id: number
  documentId: string
  title: string
}
