import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

import styles from './ErrorPage.module.scss'

const ErrorPage = () => {
  const error = useRouteError()

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Unexpected application error'

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.text}>{message}</p>
    </section>
  )
}

export default ErrorPage
