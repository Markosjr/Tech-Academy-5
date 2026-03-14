export interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface ProjectFormData {
  name: string
  description: string
}