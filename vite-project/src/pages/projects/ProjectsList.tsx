import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Project } from "../../@types/project"
import { listProjects, deleteProject } from "../../services/projectsStorage"

export default function ProjectsList() {
  const navigate = useNavigate()

  const [projects, setProjects] = useState<Project[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  async function loadProjects(currentPage: number) {
    try {
      const result = await listProjects(currentPage, 5)
      setProjects(result.projects)
      setPage(result.page)
      setTotalPages(Math.ceil(result.total / result.limit) || 1)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadProjects(1)
  }, [])

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Tem certeza que deseja excluir este projeto?")
    if (!confirmed) return

    try {
      await deleteProject(id)
      await loadProjects(page)
    } catch (error) {
      console.error(error)
    }
  }

  function handlePrevPage() {
    if (page > 1) {
      loadProjects(page - 1)
    }
  }

  function handleNextPage() {
    if (page < totalPages) {
      loadProjects(page + 1)
    }
  }

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Tarefas</h1>
          <p className="muted" style={{ marginTop: 8 }}>
            Gerencie suas tarefas adicionadas.
          </p>
        </div>

        <button
          onClick={() => navigate("/projetos/novo")}
          style={{
            height: 42,
            padding: "0 14px",
            borderRadius: 12,
            border: 0,
            background: "rgba(34,197,94,.90)",
            color: "#081019",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Nova Tarefa
        </button>
      </header>

      <div className="surface" style={{ padding: 16 }}>
        {projects.length === 0 ? (
          <div>
            <h2 style={{ marginTop: 0 }}>Nenhuma Tarefa Cadastrada</h2>
            <p className="muted">
              Crie a primeira tarefa para começar.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {projects.map((project) => (
              <article
                key={project.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: 14,
                  background: "rgba(255,255,255,.03)",
                  display: "grid",
                  gap: 10,
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: 18 }}>{project.title}</h2>
                  <p className="muted" style={{ margin: "8px 0 0" }}>
                    {project.description || "Sem descrição."}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => navigate(`/projetos/${project.id}`)}
                    style={{
                      height: 36,
                      padding: "0 12px",
                      borderRadius: 12,
                      border: 0,
                      background: "rgba(109,94,252,.95)",
                      color: "#fff",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Tarefas
                  </button>

                  <button
                    onClick={() => navigate(`/projetos/${project.id}/editar`)}
                    style={{
                      height: 36,
                      padding: "0 12px",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "rgba(255,255,255,.03)",
                      color: "var(--text)",
                      cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(project.id)}
                    style={{
                      height: 36,
                      padding: "0 12px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,77,79,.35)",
                      background: "rgba(255,77,79,.12)",
                      color: "var(--text)",
                      cursor: "pointer",
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
            gap: 12,
          }}
        >
          <button
            onClick={handlePrevPage}
            disabled={page <= 1}
            style={{
              height: 38,
              padding: "0 12px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "rgba(255,255,255,.03)",
              color: "var(--text)",
              cursor: page <= 1 ? "not-allowed" : "pointer",
              opacity: page <= 1 ? 0.5 : 1,
            }}
          >
            Anterior
          </button>

          <span className="muted">
            Página {page} de {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={page >= totalPages}
            style={{
              height: 38,
              padding: "0 12px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "rgba(255,255,255,.03)",
              color: "var(--text)",
              cursor: page >= totalPages ? "not-allowed" : "pointer",
              opacity: page >= totalPages ? 0.5 : 1,
            }}
          >
            Próxima
          </button>
        </footer>
      </div>
    </section>
  )
}