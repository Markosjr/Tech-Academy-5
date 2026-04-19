import { NavLink } from "react-router-dom"
import styles from "./sidebar.module.css"

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={`container ${styles.inner}`}>
        <section className={`surface ${styles.card}`}>
          <div className={styles.sectionTitle}>Menu</div>

          <nav className={styles.nav}>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? `${styles.item} ${styles.active}` : styles.item
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/projetos"
              className={({ isActive }) =>
                isActive ? `${styles.item} ${styles.active}` : styles.item
              }
            >
              Tarefas
            </NavLink>
          </nav>
        </section>
      </div>
    </aside>
  )
}