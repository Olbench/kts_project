import styles from './PlaceholderPage.module.scss'

type PlaceholderPageProps = {
  title: string
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.text}>Page is in progress.</p>
    </section>
  )
}

export default PlaceholderPage
