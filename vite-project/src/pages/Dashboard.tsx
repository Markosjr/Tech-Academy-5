import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getDashboardStats } from "../services/dashboardService"
import type { DashboardStats } from "../services/dashboardService"

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erro desconhecido"
        console.error("Erro ao carregar estatísticas", error)
        alert("Erro no dashboard: " + message)
      }
    }
    loadStats()
  }, [])

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="surface" style={{ padding: 22, borderRadius: 16 }}>
        <h1 style={{ margin: 0, fontSize: 26 }}>Olá, <span style={{ color: "var(--neon-purple)" }}>{user?.name?.split(" ")[0]}</span>! ✨</h1>
        <p className="muted" style={{ marginTop: 8, fontSize: 15 }}>
          Aqui está um resumo do seu progresso hoje.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard 
          title="Projetos" 
          value={stats?.totalProjects ?? 0} 
          color="#6d5efc" 
          icon="📁"
        />
        <StatCard 
          title="Tarefas Totais" 
          value={stats?.totalTasks ?? 0} 
          color="#a855f7" 
          icon="📝"
        />
        <StatCard 
          title="Pendentes" 
          value={stats?.pendingTasks ?? 0} 
          color="#f59e0b" 
          icon="⏳"
        />
        <StatCard 
          title="Concluídas" 
          value={stats?.completedTasks ?? 0} 
          color="#22c55e" 
          icon="✅"
        />
      </div>

      <div style={{ display: "flex", gap: 12 }}>
         <button
            onClick={() => navigate("/projetos")}
            style={{
              height: 44,
              padding: "0 20px",
              borderRadius: 12,
              border: 0,
              background: "rgba(109,94,252,.95)",
              color: "#fff",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Ver Meus Projetos
          </button>
          
          <button
            onClick={handleLogout}
            style={{
              height: 44,
              padding: "0 20px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "rgba(255,255,255,.05)",
              color: "var(--text)",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sair
          </button>
      </div>
    </div>
  )
}

function StatCard({ title, value, color, icon }: { title: string, value: number, color: string, icon: string }) {
  return (
    <div className="surface" style={{ 
      padding: 20, 
      borderRadius: 16, 
      borderLeft: `4px solid ${color}`,
      background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)`,
      transition: "transform 0.2s ease"
    }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div className="muted" style={{ fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: "var(--text)", marginTop: 4 }}>{value}</div>
    </div>
  )
}