import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  createProject,
  getProjectById,
  updateProject,
} from "../../services/projectsStorage"

interface ProjectFormProps {
  mode: "create" | "edit"
}

interface FormState {
  title: string
  description: string
}

export default function ProjectForm({ mode }: ProjectFormProps) {
  const navigate = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
  })

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    async function loadData() {
      if (mode !== "edit") return
      if (!id) {
        setError("ID do projeto não informado.")
        return
      }

      try {
        const project = await getProjectById(id)
        if (!project) {
          setError("Projeto não encontrado.")
          return
        }

        setForm({
          title: project.title,
          description: project.description,
        })
      } catch (err) {
        setError("Erro ao carregar dados do projeto.")
      }
    }
    loadData()
  }, [id, mode])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validate(): string | null {
    if (!form.title.trim()) return "Nome do projeto é obrigatório."
    if (form.title.trim().length < 3) {
      return "Nome do projeto deve ter pelo menos 3 caracteres."
    }
    return null
  }

  function handleCancel() {
    navigate("/projetos")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      if (mode === "create") {
        await createProject({
          title: form.title,
          description: form.description,
        })
      } else {
        if (!id) {
          throw new Error("ID do projeto não informado.")
        }

        await updateProject(id, {
          title: form.title,
          description: form.description,
        })
      }

      navigate("/projetos", { replace: true })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao salvar projeto."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <header>
        <h1 style={{ margin: 0 }}>
          {mode === "create" ? "Novo projeto" : "Editar projeto"}
        </h1>
        <p className="muted" style={{ marginTop: 8 }}>
          {mode === "create"
            ? "Preencha os dados para criar um novo projeto."
            : "Atualize os dados do projeto."}
        </p>
      </header>

      <div className="surface" style={{ padding: 16 }}>
        {error && (
          <div style={{ marginBottom: 12, color: "rgba(255,77,79,.95)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label htmlFor="title">Nome do projeto</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex.: Sistema de Gestão Acadêmica"
              style={{
                height: 44,
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,.03)",
                padding: "0 12px",
                color: "var(--text)",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descreva brevemente o projeto"
              rows={5}
              style={{
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,.03)",
                padding: "12px",
                color: "var(--text)",
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 4,
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                height: 42,
                padding: "0 14px",
                borderRadius: 12,
                border: 0,
                background: "rgba(109,94,252,.95)",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {loading
                ? "Salvando..."
                : mode === "create"
                ? "Criar projeto"
                : "Salvar alterações"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              style={{
                height: 42,
                padding: "0 14px",
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,.03)",
                color: "var(--text)",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}