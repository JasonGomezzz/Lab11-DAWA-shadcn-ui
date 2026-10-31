export type Priority = "Baja" | "Media" | "Alta" | "Urgente"
export type ProjectStatus = "Planificado" | "En progreso" | "En revisión" | "Completado"
export type TaskStatus = "Pendiente" | "En progreso" | "Completado"
export type Role = "Admin" | "Editor" | "Miembro"

export const PRIORITIES: Priority[] = ["Baja", "Media", "Alta", "Urgente"]
export const PROJECT_STATUSES: ProjectStatus[] = ["Planificado", "En progreso", "En revisión", "Completado"]
export const TASK_STATUSES: TaskStatus[] = ["Pendiente", "En progreso", "Completado"]
export const ROLES: Role[] = ["Admin", "Editor", "Miembro"]
export const CATEGORIES = ["Desarrollo Web", "Desarrollo Mobile", "Diseño", "Marketing", "Otro"]

export interface Project {
  id: string
  name: string
  description: string
  category: string
  priority: Priority
  status: ProjectStatus
  deadline: string // yyyy-MM-dd
}

export interface Member {
  userId: string
  role: Role
  name: string
  email: string
  position: string
  birthdate: string // yyyy-MM-dd
  phone: string
  projectId: string // "" = sin proyecto
  isActive: boolean
}

export interface Task {
  id: string
  description: string
  projectId: string
  status: TaskStatus
  priority: Priority
  userId: string // "" = sin asignar
  dateline: string // yyyy-MM-dd
}

export interface Activity {
  id: string
  text: string
  time: string // hora (HH:mm) en que ocurrió la acción
}

export interface Settings {
  orgName: string
  contactEmail: string
  language: "es" | "en" | "pt"
  itemsPerPage: "5" | "10"
  notifyTasks: boolean
  notifyEmail: boolean
  weeklyReport: boolean
}
