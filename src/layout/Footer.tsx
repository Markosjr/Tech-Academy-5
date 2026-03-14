import styles from "./footer.module.css"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div>
          <strong className={styles.brand}>Agenda Fácil</strong>
          <p className={styles.text}>
            Sistema de gestão de tarefas para organizar suas atividades do dia a dia.
          </p>
        </div>

        <div className={styles.right}>
          <span className={styles.copy}>© {currentYear} Agenda Fácil</span>
          <span className={styles.separator}>•</span>
          <span className={styles.copy}>Projeto Tech Academy - TADS</span>
        </div>
      </div>
    </footer>
  )
}