import type { Project, ProjectFormData } from "../@types/project"

const PROJECTS_KEY = "@todo.projects"

function readProjects(): Project[] {
  const raw = localStorage.getItem(PROJECTS_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw) as Project[]
  } catch {
    return []
  }
}

function writeProjects(projects: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

function generateId(): string {
  return crypto.randomUUID()
}

export interface PaginatedProjectsResult {
  data: Project[]
  page: number
  totalPages: number
  totalItems: number
}

export function listProjects(page = 1, perPage = 5): PaginatedProjectsResult {
  const projects = readProjects().sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const totalItems = projects.length
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage))
  const safePage = Math.min(Math.max(page, 1), totalPages)

  const start = (safePage - 1) * perPage
  const end = start + perPage

  return {
    data: projects.slice(start, end),
    page: safePage,
    totalPages,
    totalItems,
  }
}

export function getProjectById(id: string): Project | null {
  const projects = readProjects()
  return projects.find((project) => project.id === id) ?? null
}

export function createProject(input: ProjectFormData): Project {
  const projects = readProjects()
  const now = new Date().toISOString()

  const newProject: Project = {
    id: generateId(),
    name: input.name.trim(),
    description: input.description.trim(),
    createdAt: now,
    updatedAt: now,
  }

  writeProjects([newProject, ...projects])
  return newProject
}

export function updateProject(id: string, input: ProjectFormData): Project {
  const projects = readProjects()
  const index = projects.findIndex((project) => project.id === id)

  if (index === -1) {
    throw new Error("Projeto não encontrado.")
  }

  const updatedProject: Project = {
    ...projects[index],
    name: input.name.trim(),
    description: input.description.trim(),
    updatedAt: new Date().toISOString(),
  }

  projects[index] = updatedProject
  writeProjects(projects)

  return updatedProject
}

export function deleteProject(id: string): void {
  const projects = readProjects()
  const filtered = projects.filter((project) => project.id !== id)
  writeProjects(filtered)
}