export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  projectId: string
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description: string
  status?: TaskStatus
  projectId: string
}