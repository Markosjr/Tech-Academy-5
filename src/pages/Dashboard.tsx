import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="surface" style={{ padding: 18 }}>
      <h1 style={{ margin: 0 }}>Dashboard</h1>
      <p className="muted" style={{ marginTop: 8 }}>
        Bem-vindo{user?.name ? `, ${user.name}` : ""}.
      </p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: 14,
          height: 40,
          padding: "0 14px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "rgba(255,255,255,.03)",
          color: "var(--text)",
          cursor: "pointer",
        }}
      >
        Sair
      </button>
    </div>
  )
}