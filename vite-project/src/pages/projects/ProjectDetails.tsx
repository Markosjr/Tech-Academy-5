import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { Project } from "../../@types/project"
import type { Task, TaskStatus } from "../../@types/task"
import { getProjectById } from "../../services/projectsStorage"
import { listTasksByProject, createTask, updateTask, deleteTask } from "../../services/tasksService"

export default function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [newTaskTitle, setNewTaskTitle] = useState("")

  useEffect(() => {
    async function loadData() {
      if (!id) return
      try {
        const p = await getProjectById(id)
        if (!p) {
          navigate("/projetos")
          return
        }
        setProject(p)
        const t = await listTasksByProject(id, 1, 100)
        setTasks(t.tasks)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, navigate])

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTaskTitle.trim() || !id) return
    try {
      const task = await createTask({
        title: newTaskTitle,
        description: "",
        projectId: id
      })
      setTasks(prev => [task, ...prev])
      setNewTaskTitle("")
    } catch (err) {
      alert("Erro ao criar tarefa")
    }
  }

  async function handleToggleStatus(task: Task) {
    const nextStatus: TaskStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED"
    try {
      await updateTask(task.id, { status: nextStatus, projectId: task.projectId })
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus } : t))
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : "Erro desconhecido"
      alert("Erro ao atualizar tarefa: " + message)
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!window.confirm("Excluir tarefa?")) return
    try {
      await deleteTask(taskId)
      setTasks(prev => prev.filter(t => t.id !== taskId))
    } catch (err) {
      alert("Erro ao excluir tarefa")
    }
  }

  if (loading) return <div className="muted">Carregando detalhes...</div>

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <header className="surface" style={{ padding: 22, borderRadius: 16 }}>
        <button 
          onClick={() => navigate("/projetos")}
          style={{ background: "none", border: 0, color: "var(--neon-purple)", cursor: "pointer", fontWeight: 700, marginBottom: 10, padding: 0 }}
        >
          ← Voltar para projetos
        </button>
        <h1 style={{ margin: 0 }}>{project?.title}</h1>
        <p className="muted" style={{ marginTop: 8 }}>{project?.description || "Sem descrição."}</p>
      </header>

      <div className="surface" style={{ padding: 20, borderRadius: 16 }}>
        <h2 style={{ margin: "0 0 16px" }}>Nova Tarefa</h2>
        <form onSubmit={handleCreateTask} style={{ display: "flex", gap: 10 }}>
          <input 
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            placeholder="O que precisa ser feito?"
            style={{ 
              flex: 1, 
              height: 44, 
              borderRadius: 12, 
              border: "1px solid var(--border)", 
              background: "rgba(255,255,255,0.03)", 
              padding: "0 14px",
              color: "var(--text)"
            }}
          />
          <button 
            type="submit"
            style={{ 
              height: 44, 
              padding: "0 20px", 
              borderRadius: 12, 
              border: 0, 
              background: "var(--neon-purple)", 
              color: "#fff", 
              fontWeight: 800, 
              cursor: "pointer" 
            }}
          >
            Adicionar
          </button>
        </form>
      </div>

      <div className="surface" style={{ padding: 20, borderRadius: 16 }}>
        <h2 style={{ margin: "0 0 16px" }}>Tarefas do Projeto</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {tasks.length === 0 ? (
            <p className="muted">Nenhuma tarefa encontrada.</p>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id} 
                className="surface"
                style={{ 
                  padding: 14, 
                  borderRadius: 12, 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input 
                    type="checkbox" 
                    checked={task.status === "COMPLETED"} 
                    onChange={() => handleToggleStatus(task)}
                    style={{ width: 18, height: 18, cursor: "pointer" }}
                  />
                  <span style={{ 
                    fontSize: 16, 
                    textDecoration: task.status === "COMPLETED" ? "line-through" : "none",
                    opacity: task.status === "COMPLETED" ? 0.5 : 1
                  }}>
                    {task.title}
                  </span>
                </div>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  style={{ background: "rgba(255,77,79,0.1)", border: "1px solid rgba(255,77,79,0.3)", color: "#ff4d4f", padding: "4px 8px", borderRadius: 8, cursor: "pointer", fontSize: 12 }}
                >
                  Excluir
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
