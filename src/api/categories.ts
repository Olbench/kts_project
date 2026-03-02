import axios from 'axios'

import { API_BASE_URL } from '@/config/api'
import type { CategoryEntity } from '@/types/product'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

const toObject = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : {}

const toStringValue = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toNumberValue = (value: unknown, fallback = 0): number =>
  typeof value === 'number' ? value : fallback

const mapCategory = (value: unknown): CategoryEntity | null => {
  const raw = toObject(value)

  const id = toNumberValue(raw.id)
  const documentId = toStringValue(raw.documentId)
  const title = toStringValue(raw.title)

  if (!id || !title) {
    return null
  }

  return { id, documentId, title }
}

export const getCategories = async (): Promise<CategoryEntity[]> => {
  const response = await apiClient.get('/product-categories')
  const responseData = toObject(response.data)
  const data = Array.isArray(responseData.data) ? responseData.data : []

  return data
    .map(mapCategory)
    .filter((category): category is CategoryEntity => category !== null)
}
