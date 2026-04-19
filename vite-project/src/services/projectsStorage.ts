import { api } from "./api"
import type { Project, ProjectFormData } from "../@types/project"

export interface PaginatedProjectsResult {
  projects: Project[]
  page: number
  total: number
  limit: number
}

export async function listProjects(page = 1, limit = 5): Promise<PaginatedProjectsResult> {
  return await api.get<PaginatedProjectsResult>(`/projects?page=${page}&limit=${limit}`)
}

export async function getProjectById(id: string): Promise<Project | null> {
  // O backend não tem rota de busca por ID específica, mas a listagem traz ou podemos adicionar
  // Por ora, vamos filtrar na lista ou assumir que o serviço de listagem resolve para a UI
  const { projects } = await listProjects(1, 1000)
  return projects.find((p) => p.id === id) || null
}

export async function createProject(input: ProjectFormData): Promise<Project> {
  return await api.post<Project, ProjectFormData>("/projects", input)
}

export async function updateProject(id: string, input: ProjectFormData): Promise<void> {
  await api.put<void, ProjectFormData>(`/projects/${id}`, input)
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`)
}