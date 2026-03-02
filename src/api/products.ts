import axios from 'axios'
import qs from 'qs'

import { API_BASE_URL } from '@/config/api'
import type { ProductEntity, ProductsListResult } from '@/types/product'

const MEDIA_BASE_URL = 'https://front-school-strapi.ktsdev.ru'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

const toObject = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : {}

const toStringValue = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toNumberValue = (value: unknown, fallback = 0): number =>
  typeof value === 'number' ? value : fallback

const toBooleanValue = (value: unknown, fallback = false): boolean =>
  typeof value === 'boolean' ? value : fallback

const normalizeImageUrl = (url: string): string => {
  if (!url) {
    return ''
  }

  try {
    return new URL(url, MEDIA_BASE_URL).toString()
  } catch {
    return ''
  }
}

const pickImageUrl = (raw: Record<string, unknown>): string => {
  const images = raw.images
  const imagesObject = toObject(images)

  if (Array.isArray(images)) {
    const first = toObject(images[0])
    return normalizeImageUrl(toStringValue(first.url))
  }

  if (Array.isArray(imagesObject.data)) {
    const firstData = toObject(imagesObject.data[0])
    const attributes = toObject(firstData.attributes)
    return normalizeImageUrl(toStringValue(attributes.url))
  }

  return ''
}

const pickCategory = (raw: Record<string, unknown>): { title: string; id: number } => {
  const category = toObject(raw.productCategory)

  if (Array.isArray(category)) {
    const first = toObject(category[0])
    return {
      title: toStringValue(first.title, 'Unknown category'),
      id: toNumberValue(first.id),
    }
  }

  if (category.data) {
    const relation = toObject(category.data)
    const attributes = toObject(relation.attributes)
    return {
      title: toStringValue(attributes.title || relation.title, 'Unknown category'),
      id: toNumberValue(relation.id),
    }
  }

  return {
    title: toStringValue(category.title, 'Unknown category'),
    id: toNumberValue(category.id),
  }
}

const mapProduct = (value: unknown): ProductEntity | null => {
  const raw = toObject(value)
  const attributes = toObject(raw.attributes)
  const source = Object.keys(attributes).length > 0 ? attributes : raw

  const id = toNumberValue(raw.id)
  const documentId =
    toStringValue(raw.documentId) || toStringValue(source.documentId) || String(id)

  if (!id || !documentId) {
    return null
  }

  const categoryInfo = pickCategory(source)

  return {
    id,
    documentId,
    title: toStringValue(source.title, 'Untitled product'),
    description: toStringValue(source.description, 'No description'),
    price: toNumberValue(source.price),
    discountPercent: toNumberValue(source.discountPercent),
    rating: toNumberValue(source.rating),
    isInStock: toBooleanValue(source.isInStock, true),
    category: categoryInfo.title,
    categoryId: categoryInfo.id,
    imageUrl: pickImageUrl(source),
  }
}

export type GetProductsParams = {
  page?: number
  pageSize?: number
  search?: string
  categoryId?: number
}

export const getProducts = async (
  params: GetProductsParams = {},
): Promise<ProductsListResult> => {
  const { page = 1, pageSize = 9, search, categoryId } = params

  const queryParams: Record<string, unknown> = {
    populate: ['images', 'productCategory'],
    pagination: {
      page,
      pageSize,
    },
  }

  const filters: Record<string, unknown> = {}

  if (search) {
    filters.title = { $containsi: search }
  }

  if (categoryId) {
    filters.productCategory = { id: { $eq: categoryId } }
  }

  if (Object.keys(filters).length > 0) {
    queryParams.filters = filters
  }

  const query = qs.stringify(queryParams, { encodeValuesOnly: true })
  const response = await apiClient.get(`/products?${query}`)

  const responseData = toObject(response.data)
  const data = Array.isArray(responseData.data) ? responseData.data : []
  const meta = toObject(responseData.meta)
  const pagination = toObject(meta.pagination)

  return {
    products: data
      .map(mapProduct)
      .filter((product): product is ProductEntity => product !== null),
    total: toNumberValue(pagination.total),
  }
}

export const getProductByDocumentId = async (
  documentId: string,
): Promise<ProductEntity | null> => {
  const query = qs.stringify(
    { populate: ['images', 'productCategory'] },
    { encodeValuesOnly: true },
  )
  const response = await apiClient.get(`/products/${documentId}?${query}`)
  const responseData = toObject(response.data)

  return mapProduct(responseData.data)
}
