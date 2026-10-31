"use client"

import { Activity, CheckCircle2, FolderKanban, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader } from "@/components/SectionHeader"
import { useDashboard } from "@/lib/store"
import { projectStatusTone } from "@/lib/ui"
import { cn } from "@/lib/utils"

const toneDot = {
  default: "bg-primary",
  secondary: "bg-muted-foreground/50",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
}

export function OverviewTab() {
  const { metrics, activity, projects, projectProgress } = useDashboard()

  const stats = [
    {
      title: "Proyectos",
      value: metrics.totalProjects,
      note: `${metrics.activeProjects} en progreso`,
      icon: FolderKanban,
      chip: "from-[#5ac8fa] to-[#0a84ff]",
    },
    {
      title: "Completadas",
      value: metrics.completedTasks,
      note: `de ${metrics.totalTasks} tareas`,
      icon: CheckCircle2,
      chip: "from-[#5fe07e] to-[#28a745]",
    },
    {
      title: "Pendientes",
      value: metrics.pendingTasks,
      note: `${metrics.urgentTasks} de prioridad alta o urgente`,
      icon: Activity,
      chip: "from-[#ffb340] to-[#ff8a00]",
    },
    {
      title: "Miembros activos",
      value: metrics.activeMembers,
      note: `de ${metrics.totalMembers} en el equipo`,
      icon: Users,
      chip: "from-[#cf7cf5] to-[#8e44d6]",
    },
  ]

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ title, value, note, icon: Icon, chip }, i) => (
          <Card
            key={title}
            className="animate-tile gap-0 p-6"
            style={{ ["--i" as string]: i }}
          >
            <span
              className={cn(
                "mb-5 grid size-10 place-items-center rounded-[12px] bg-linear-to-b text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]",
                chip
              )}
            >
              <Icon className="size-5" />
            </span>
            <div className="text-[52px] leading-none font-semibold tracking-[-0.045em] tabular-nums">{value}</div>
            <div className="mt-3 text-[15px] font-medium">{title}</div>
            <div className="mt-0.5 text-[13px] text-muted-foreground">{note}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <SectionHeader title="Avance por proyecto" description="Según las tareas completadas de cada uno." />
          <Card className="animate-tile gap-0 p-0" style={{ ["--i" as string]: 4 }}>
            <CardContent className="divide-y divide-hairline p-0">
              {projects.length === 0 && (
                <p className="px-6 py-10 text-center text-muted-foreground">Aún no hay proyectos.</p>
              )}
              {projects.map((project) => {
                const progress = projectProgress(project.id)
                return (
                  <div key={project.id} className="px-6 py-4">
                    <div className="mb-2.5 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className={cn("size-2 shrink-0 rounded-full", toneDot[projectStatusTone[project.status]])} />
                        <span className="truncate text-[15px] font-medium">{project.name}</span>
                      </div>
                      <span className="text-[15px] text-muted-foreground tabular-nums">{progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-[width] duration-700 ease-apple"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </section>

        <section className="lg:col-span-2">
          <SectionHeader title="Actividad" description="Lo último que pasó en esta sesión." />
          <Card className="animate-tile gap-0 p-6" style={{ ["--i" as string]: 5 }}>
            <ol className="relative space-y-5">
              <span aria-hidden className="absolute top-2 bottom-2 left-[5px] w-px bg-hairline" />
              {activity.map((item) => (
                <li key={item.id} className="relative flex items-start gap-4">
                  <span className="relative mt-1.5 size-[11px] shrink-0 rounded-full bg-primary ring-4 ring-card" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] leading-snug">{item.text}</p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">{item.time}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </section>
      </div>
    </div>
  )
}
