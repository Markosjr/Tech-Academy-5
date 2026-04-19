import { api } from "./api"
import type { Task, TaskFormData } from "../@types/task"

export interface PaginatedTasksResult {
  tasks: Task[]
  page: number
  total: number
  limit: number
}

export async function listTasksByProject(projectId: string, page = 1, limit = 10): Promise<PaginatedTasksResult> {
  return await api.get<PaginatedTasksResult>(`/tasks/project/${projectId}?page=${page}&limit=${limit}`)
}

export async function createTask(input: TaskFormData): Promise<Task> {
  return await api.post<Task, TaskFormData>("/tasks", input)
}

export async function updateTask(id: string, input: Partial<TaskFormData>): Promise<void> {
  await api.put<void, Partial<TaskFormData>>(`/tasks/${id}`, input)
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`)
}
