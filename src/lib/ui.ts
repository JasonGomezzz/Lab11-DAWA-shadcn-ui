import type { Priority, ProjectStatus, TaskStatus } from "./types"

export type BadgeTone = "default" | "secondary" | "success" | "warning" | "destructive"

export const projectStatusTone: Record<ProjectStatus, BadgeTone> = {
  Planificado: "secondary",
  "En progreso": "default",
  "En revisión": "warning",
  Completado: "success",
}

export const taskStatusTone: Record<TaskStatus, BadgeTone> = {
  Pendiente: "secondary",
  "En progreso": "default",
  Completado: "success",
}

export const priorityTone: Record<Priority, BadgeTone> = {
  Baja: "secondary",
  Media: "default",
  Alta: "warning",
  Urgente: "destructive",
}

// Degradados sobrios, uno por persona (estable según el nombre).
const gradients = [
  "from-[#5ac8fa] to-[#0a84ff]",
  "from-[#ff9f0a] to-[#ff6a00]",
  "from-[#bf5af2] to-[#7d3cd8]",
  "from-[#34c759] to-[#1f9d45]",
  "from-[#ff6482] to-[#e5254f]",
  "from-[#64d2ff] to-[#3478f6]",
]

export function avatarGradient(seed: string): string {
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return gradients[hash % gradients.length]
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
