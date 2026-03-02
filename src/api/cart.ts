import axios from 'axios'

import { API_BASE_URL } from '@/config/api'
import { getProducts, mapProduct } from '@/api/products'
import type { ProductEntity } from '@/types/product'

type CartMutationPayload = {
  product: number
  quantity?: number
}

export type CartApiItem = {
  productId: number
  quantity: number
  product: ProductEntity
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

const toObject = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : {}

const toNumber = (value: unknown): number => (typeof value === 'number' ? value : 0)

const parseProductFromUnknown = (value: unknown): ProductEntity | null => {
  if (typeof value === 'number') {
    return null
  }

  const raw = toObject(value)
  const mapped = mapProduct(raw)

  if (mapped) {
    return mapped
  }

  return null
}

type ParsedCartEntry = {
  productId: number
  quantity: number
  product: ProductEntity | null
}

const parseCartEntry = (value: unknown): ParsedCartEntry | null => {
  const raw = toObject(value)
  const attributes = toObject(raw.attributes)
  const source = Object.keys(attributes).length > 0 ? attributes : raw
  const quantity = Math.max(1, toNumber(source.quantity) || 1)

  const sourceProduct = source.product
  const directProduct = parseProductFromUnknown(sourceProduct)

  if (directProduct) {
    return {
      productId: directProduct.id,
      quantity,
      product: directProduct,
    }
  }

  if (typeof sourceProduct === 'number') {
    return {
      productId: sourceProduct,
      quantity,
      product: null,
    }
  }

  const productRelation = toObject(sourceProduct).data
  const relationParsed = parseProductFromUnknown(productRelation)

  if (relationParsed) {
    return {
      productId: relationParsed.id,
      quantity,
      product: relationParsed,
    }
  }

  const fallbackId = toNumber(source.productId)

  if (!fallbackId) {
    return null
  }

  return {
    productId: fallbackId,
    quantity,
    product: null,
  }
}

const toRawItems = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    return value
  }

  const objectValue = toObject(value)
  const data = objectValue.data

  if (Array.isArray(data)) {
    return data
  }

  const nested = toObject(data).items
  return Array.isArray(nested) ? nested : []
}

export const getCartItems = async (): Promise<CartApiItem[]> => {
  const response = await apiClient.get('/cart')
  const rawItems = toRawItems(response.data)
  const parsed = rawItems
    .map(parseCartEntry)
    .filter((entry): entry is ParsedCartEntry => entry !== null)

  if (parsed.length === 0) {
    return []
  }

  const productById = new Map<number, ProductEntity>()

  parsed.forEach((entry) => {
    if (entry.product) {
      productById.set(entry.productId, entry.product)
    }
  })

  const missingIds = parsed
    .map((entry) => entry.productId)
    .filter((id, index, array) => array.indexOf(id) === index && !productById.has(id))

  if (missingIds.length > 0) {
    const { products } = await getProducts({
      page: 1,
      pageSize: Math.max(9, missingIds.length),
      ids: missingIds,
    })

    products.forEach((product) => {
      productById.set(product.id, product)
    })
  }

  return parsed
    .map((entry) => {
      const product = productById.get(entry.productId)

      if (!product) {
        return null
      }

      return {
        productId: entry.productId,
        quantity: entry.quantity,
        product,
      }
    })
    .filter((item, index, array): item is CartApiItem => {
      if (!item) {
        return false
      }
      return array.findIndex((candidate) => candidate?.productId === item.productId) === index
    })
}

export const addCartProduct = async (
  payload: CartMutationPayload,
): Promise<void> => {
  await apiClient.post('/cart/add', {
    product: payload.product,
    quantity: payload.quantity ?? 1,
  })
}

export const removeCartProduct = async (
  payload: CartMutationPayload,
): Promise<void> => {
  await apiClient.post('/cart/remove', {
    product: payload.product,
    quantity: payload.quantity ?? 1,
  })
}
