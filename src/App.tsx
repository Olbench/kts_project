import { Outlet } from 'react-router-dom'

import Header from '@/components/Header'

import styles from './App.module.scss'

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default App
