"use client"

import { useState } from "react"
import { CheckSquare, FolderKanban, LayoutDashboard, Settings, Users } from "lucide-react"
import { OverviewTab } from "@/components/OverviewTab"
import { ProjectForm } from "@/components/ProjectForm"
import { ProjectsTab } from "@/components/ProjectsTab"
import { SettingsTab } from "@/components/SettingsTab"
import { TasksTable } from "@/components/TasksTable"
import { TeamTab } from "@/components/TeamTab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardProvider, useDashboard } from "@/lib/store"

const SECTIONS = [
  { value: "overview", label: "Resumen", icon: LayoutDashboard, title: "Resumen", lead: "Cómo va todo, de un vistazo." },
  { value: "projects", label: "Proyectos", icon: FolderKanban, title: "Proyectos", lead: "Todo lo que está en marcha y su avance." },
  { value: "team", label: "Equipo", icon: Users, title: "Equipo", lead: "Las personas detrás de cada proyecto." },
  { value: "tasks", label: "Tareas", icon: CheckSquare, title: "Tareas", lead: "Lo que hay que hacer, quién y para cuándo." },
  { value: "settings", label: "Configuración", icon: Settings, title: "Configuración", lead: "Ajusta el dashboard a tu manera." },
] as const

function DashboardContent() {
  const { settings } = useDashboard()
  const [tab, setTab] = useState<(typeof SECTIONS)[number]["value"]>("overview")
  const index = SECTIONS.findIndex((s) => s.value === tab)
  const section = SECTIONS[index]

  return (
    <div className="min-h-dvh">
      {/* Barra translúcida: el contenido pasa por debajo */}
      <header className="glass sticky top-0 z-40 border-b border-hairline">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-[9px] bg-linear-to-b from-[#3d9bff] to-[#0071e3] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]">
              <LayoutDashboard className="size-4" />
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.01em]">{settings.orgName}</span>
          </div>
          <ProjectForm />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-6 sm:pt-14">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="gap-8">
          {/* Título grande, como en iOS: cambia con la sección */}
          <div key={tab} className="animate-panel">
            <p className="mb-2 text-[15px] font-semibold text-primary">Dashboard de Proyectos</p>
            <h1 className="text-[44px] leading-[1.03] font-semibold tracking-[-0.035em] sm:text-[64px]">
              {section.title}
            </h1>
            <p className="mt-3 max-w-xl text-lg text-muted-foreground sm:text-xl">{section.lead}</p>
          </div>

          {/* Control segmentado: la píldora blanca se desliza entre secciones */}
          <TabsList className="grid h-12 w-full grid-cols-5 sm:max-w-[640px]">
            <span
              aria-hidden
              className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/5)] rounded-full bg-(--seg-thumb) shadow-[0_1px_3px_rgb(0_0_0/0.12),0_1px_1px_rgb(0_0_0/0.06)] transition-transform duration-300 ease-apple"
              style={{ transform: `translateX(${index * 100}%)` }}
            />
            {SECTIONS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} aria-label={label} className="h-10">
                <Icon />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="projects">
            <ProjectsTab />
          </TabsContent>
          <TabsContent value="team">
            <TeamTab />
          </TabsContent>
          <TabsContent value="tasks">
            <TasksTable />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  )
}
