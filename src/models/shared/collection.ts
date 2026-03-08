export type CollectionModel<K extends string | number, T> = {
  order: K[]
  entities: Record<K, T>
}

export const getInitialCollectionModel = (): CollectionModel<never, never> => ({
  order: [],
  entities: {} as Record<never, never>,
})

export const normalizeCollection = <K extends string | number, T>(
  elements: T[],
  getKeyForElement: (element: T) => K,
): CollectionModel<K, T> => {
  const collection: CollectionModel<K, T> = {
    order: [],
    entities: {} as Record<K, T>,
  }

  elements.forEach((el) => {
    const id = getKeyForElement(el)
    collection.order.push(id)
    collection.entities[id] = el
  })

  return collection
}

export const linearizeCollection = <K extends string | number, T>(
  elements: CollectionModel<K, T>,
): T[] => elements.order.map((el) => elements.entities[el])
