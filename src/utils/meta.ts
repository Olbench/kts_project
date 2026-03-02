export const Meta = {
  initial: 'initial',
  loading: 'loading',
  success: 'success',
  error: 'error',
} as const

export type Meta = (typeof Meta)[keyof typeof Meta]
