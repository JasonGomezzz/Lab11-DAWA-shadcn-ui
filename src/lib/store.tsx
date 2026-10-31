"use client"

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import { seedMembers, seedProjects, seedSettings, seedTasks } from "./seed"
import type { Activity, Member, Project, Settings, Task } from "./types"

const LATENCY_MS = 700

// Simula una petición al backend: resuelve tras un retardo.
function simulateRequest(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, LATENCY_MS))
}

interface Metrics {
  totalProjects: number
  activeProjects: number
  completedTasks: number
  totalTasks: number
  pendingTasks: number
  urgentTasks: number
  activeMembers: number
  totalMembers: number
}

interface DashboardContextValue {
  projects: Project[]
  members: Member[]
  tasks: Task[]
  settings: Settings
  activity: Activity[]
  metrics: Metrics
  projectProgress: (projectId: string) => number
  addProject: (data: Omit<Project, "id">, memberIds: string[]) => Promise<void>
  updateProject: (id: string, data: Omit<Project, "id">, memberIds: string[]) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  addMember: (data: Omit<Member, "userId">) => Promise<void>
  updateMember: (userId: string, data: Omit<Member, "userId">) => Promise<void>
  deleteMember: (userId: string) => Promise<void>
  addTask: (data: Omit<Task, "id">) => Promise<void>
  updateTask: (id: string, data: Omit<Task, "id">) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  saveSettings: (data: Settings) => Promise<void>
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState(seedProjects)
  const [members, setMembers] = useState(seedMembers)
  const [tasks, setTasks] = useState(seedTasks)
  const [settings, setSettings] = useState(seedSettings)
  const [activity, setActivity] = useState<Activity[]>([
    { id: "a0", text: "Se cargaron los datos de ejemplo", time: "Inicio" },
  ])
  const counter = useRef(100)

  const newId = (prefix: string) => `${prefix}${counter.current++}`

  const log = useCallback((text: string) => {
    const time = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
    setActivity((prev) => [{ id: `a${counter.current++}`, text, time }, ...prev].slice(0, 8))
  }, [])

  // La relación proyecto-miembro vive en Member.projectId: asignar = actualizar miembros.
  const assignMembers = (projectId: string, memberIds: string[]) =>
    setMembers((prev) =>
      prev.map((m) =>
        memberIds.includes(m.userId) ? { ...m, projectId } : m.projectId === projectId ? { ...m, projectId: "" } : m
      )
    )

  const addProject: DashboardContextValue["addProject"] = async (data, memberIds) => {
    await simulateRequest()
    const id = newId("p")
    setProjects((prev) => [...prev, { ...data, id }])
    assignMembers(id, memberIds)
    log(`Se creó el proyecto "${data.name}"`)
  }

  const updateProject: DashboardContextValue["updateProject"] = async (id, data, memberIds) => {
    await simulateRequest()
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...data, id } : p)))
    assignMembers(id, memberIds)
    log(`Se actualizó el proyecto "${data.name}"`)
  }

  const deleteProject: DashboardContextValue["deleteProject"] = async (id) => {
    await simulateRequest()
    const name = projects.find((p) => p.id === id)?.name
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setTasks((prev) => prev.filter((t) => t.projectId !== id))
    setMembers((prev) => prev.map((m) => (m.projectId === id ? { ...m, projectId: "" } : m)))
    log(`Se eliminó el proyecto "${name}"`)
  }

  const addMember: DashboardContextValue["addMember"] = async (data) => {
    await simulateRequest()
    setMembers((prev) => [...prev, { ...data, userId: newId("u") }])
    log(`Se agregó a ${data.name} al equipo`)
  }

  const updateMember: DashboardContextValue["updateMember"] = async (userId, data) => {
    await simulateRequest()
    setMembers((prev) => prev.map((m) => (m.userId === userId ? { ...data, userId } : m)))
    log(`Se actualizó a ${data.name}`)
  }

  const deleteMember: DashboardContextValue["deleteMember"] = async (userId) => {
    await simulateRequest()
    const name = members.find((m) => m.userId === userId)?.name
    setMembers((prev) => prev.filter((m) => m.userId !== userId))
    setTasks((prev) => prev.map((t) => (t.userId === userId ? { ...t, userId: "" } : t)))
    log(`Se eliminó a ${name} del equipo`)
  }

  const addTask: DashboardContextValue["addTask"] = async (data) => {
    await simulateRequest()
    setTasks((prev) => [...prev, { ...data, id: newId("t") }])
    log(`Se creó la tarea "${data.description}"`)
  }

  const updateTask: DashboardContextValue["updateTask"] = async (id, data) => {
    await simulateRequest()
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...data, id } : t)))
    log(`Se actualizó la tarea "${data.description}" (${data.status})`)
  }

  const deleteTask: DashboardContextValue["deleteTask"] = async (id) => {
    await simulateRequest()
    const description = tasks.find((t) => t.id === id)?.description
    setTasks((prev) => prev.filter((t) => t.id !== id))
    log(`Se eliminó la tarea "${description}"`)
  }

  const saveSettings: DashboardContextValue["saveSettings"] = async (data) => {
    await simulateRequest()
    setSettings(data)
    log("Se guardó la configuración")
  }

  const projectProgress = useCallback(
    (projectId: string) => {
      const own = tasks.filter((t) => t.projectId === projectId)
      if (own.length === 0) return 0
      return Math.round((own.filter((t) => t.status === "Completado").length / own.length) * 100)
    },
    [tasks]
  )

  const metrics = useMemo<Metrics>(() => {
    const open = tasks.filter((t) => t.status !== "Completado")
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === "En progreso").length,
      completedTasks: tasks.length - open.length,
      totalTasks: tasks.length,
      pendingTasks: open.length,
      urgentTasks: open.filter((t) => t.priority === "Alta" || t.priority === "Urgente").length,
      activeMembers: members.filter((m) => m.isActive).length,
      totalMembers: members.length,
    }
  }, [projects, tasks, members])

  const value: DashboardContextValue = {
    projects, members, tasks, settings, activity, metrics, projectProgress,
    addProject, updateProject, deleteProject,
    addMember, updateMember, deleteMember,
    addTask, updateTask, deleteTask, saveSettings,
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard debe usarse dentro de DashboardProvider")
  return ctx
}
