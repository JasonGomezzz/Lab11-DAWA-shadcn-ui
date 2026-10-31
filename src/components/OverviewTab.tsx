"use client"

import { Activity, CheckCircle2, FolderKanban, Users } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "@/lib/store"

export function OverviewTab() {
  const { metrics, activity } = useDashboard()

  const stats = [
    {
      title: "Total Proyectos",
      value: metrics.totalProjects,
      note: `${metrics.activeProjects} en progreso`,
      icon: FolderKanban,
    },
    {
      title: "Tareas Completadas",
      value: metrics.completedTasks,
      note: `de ${metrics.totalTasks} tareas en total`,
      icon: CheckCircle2,
    },
    {
      title: "Tareas Pendientes",
      value: metrics.pendingTasks,
      note: `${metrics.urgentTasks} de prioridad alta o urgente`,
      icon: Activity,
    },
    {
      title: "Miembros Activos",
      value: metrics.activeMembers,
      note: `de ${metrics.totalMembers} miembros`,
      icon: Users,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ title, value, note, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimos cambios realizados en esta sesión</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activity.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{item.text[0]}</AvatarFallback>
                </Avatar>
                <p className="flex-1 text-sm font-medium leading-none">{item.text}</p>
                <div className="text-sm text-muted-foreground">{item.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
