export type ProductEntity = {
  id: number
  documentId: string
  title: string
  description: string
  price: number
  category: string
  imageUrl: string
}

export type ProductsListResult = {
  products: ProductEntity[]
  total: number
}
