import { Link, NavLink } from 'react-router-dom'

import cartIcon from '@/assets/icons/icon_cart.svg'
import logoIcon from '@/assets/icons/logo.svg'
import userIcon from '@/assets/icons/icon_user.svg'

import styles from './Header.module.scss'

const getNavClassName = ({ isActive }: { isActive: boolean }): string =>
  `${styles.link} ${isActive ? styles.linkActive : ''}`

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.logo} to="/products">
          <img alt="Lalasia" className={styles.logoIcon} src={logoIcon} />
          <span>Lalasia</span>
        </Link>

        <nav className={styles.nav}>
          <NavLink className={getNavClassName} to="/products">
            Products
          </NavLink>
          <NavLink className={getNavClassName} to="/categories">
            Categories
          </NavLink>
          <NavLink className={getNavClassName} to="/about-us">
            About us
          </NavLink>
        </nav>

        <div className={styles.actions}>
          <Link aria-label="Cart" className={styles.iconLink} to="/cart">
            <img alt="Cart" className={styles.icon} src={cartIcon} />
          </Link>
          <Link aria-label="User profile" className={styles.iconLink} to="/user-profile">
            <img alt="User profile" className={styles.icon} src={userIcon} />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
