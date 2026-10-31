"use client"

import { OverviewTab } from "@/components/OverviewTab"
import { ProjectForm } from "@/components/ProjectForm"
import { ProjectsTab } from "@/components/ProjectsTab"
import { SettingsTab } from "@/components/SettingsTab"
import { TasksTable } from "@/components/TasksTable"
import { TeamTab } from "@/components/TeamTab"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardProvider, useDashboard } from "@/lib/store"

function DashboardContent() {
  const { settings } = useDashboard()

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 to-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-slate-900">Dashboard de Proyectos</h1>
          <p className="text-slate-600">
            {settings.orgName} · Gestiona tus proyectos y tareas con shadcn/ui
          </p>
          <div className="pt-4">
            <ProjectForm />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
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
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Tareas</CardTitle>
                <CardDescription>Administra todas las tareas de tus proyectos</CardDescription>
              </CardHeader>
              <CardContent>
                <TasksTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
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
