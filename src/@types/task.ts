export type TaskStatus = "PENDENTE" | "FEITO" | "ARQUIVADO"

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  userId: string
  createdAt: Date
}