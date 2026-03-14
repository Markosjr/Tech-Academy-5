import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./Sidebar"
import Footer from "./Footer"
import styles from "./appShell.module.css"

export default function AppShell() {
  return (
    <div className={styles.shell}>
      <Header />

      <div className={styles.body}>
        <Sidebar />

        <main className={styles.main}>
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}