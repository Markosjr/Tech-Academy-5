import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import styles from "./header.module.css"

export default function Header() {
 const navigate = useNavigate()
 const { user, isAuthenticated, logout } = useAuth()

 function handleLogout() {
   logout()
   navigate("/login", { replace: true })
 }

 return (
   <header className={styles.header}>
     <div className={`container ${styles.inner}`}>
       <div className={styles.brand} onClick={() => navigate("/dashboard")}>
         <div className={styles.logo} />
         <div>
           <div className={styles.title}>Agenda Fácil</div>
           <div className={styles.subtitle}>Gestão de tarefas</div>
         </div>
       </div>

       <div className={styles.right}>
         {isAuthenticated ? (
           <>
             <div className={styles.user}>
               <span className={styles.avatar}>
                 {(user?.name?.[0] ?? "U").toUpperCase()}
               </span>
               <span className={styles.name}>{user?.name ?? "Usuário"}</span>
             </div>
             <button className={styles.ghost} onClick={handleLogout}>
               Sair
             </button>
           </>
         ) : (
           <button className={styles.primary} onClick={() => navigate("/login")}>
             Entrar
           </button>
         )}
       </div>
     </div>
   </header>
 )
}
