"use client"

import { useState } from "react"
import { CalendarDays, Pencil, Trash2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { ProjectDetails } from "@/components/ProjectDetails"
import { ProjectForm } from "@/components/ProjectForm"
import { formatDate } from "@/lib/date"
import { useDashboard } from "@/lib/store"
import { projectStatusTone } from "@/lib/ui"
import type { Project } from "@/lib/types"

export function ProjectsTab() {
  const { projects, members, projectProgress, deleteProject } = useDashboard()
  const [details, setDetails] = useState<Project | null>(null)
  const [editing, setEditing] = useState<Project | null>(null)
  const [removing, setRemoving] = useState<Project | null>(null)

  if (projects.length === 0) {
    return (
      <Card className="items-center py-16 text-center">
        <p className="text-lg font-semibold tracking-[-0.01em]">Sin proyectos</p>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Crea el primero con el botón &quot;Nuevo Proyecto&quot;.
        </p>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => {
          const progress = projectProgress(project.id)
          const teamSize = members.filter((m) => m.projectId === project.id).length
          return (
            <Card
              key={project.id}
              className="animate-tile gap-0 p-6 transition-[transform,box-shadow] duration-300 ease-apple hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgb(0_0_0/0.04),0_16px_40px_rgb(0_0_0/0.09)]"
              style={{ ["--i" as string]: Math.min(i, 8) }}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <Badge variant={projectStatusTone[project.status]}>{project.status}</Badge>
                <span className="text-xs text-muted-foreground">{project.category}</span>
              </div>

              <h3 className="text-xl leading-snug font-semibold tracking-[-0.02em]">{project.name}</h3>
              <p className="mt-1.5 line-clamp-2 min-h-[2.75rem] text-[15px] leading-snug text-muted-foreground">
                {project.description || "Sin descripción"}
              </p>

              <div className="mt-5">
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-[13px] text-muted-foreground">Avance</span>
                  <span className="text-[15px] font-semibold tabular-nums">{progress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-700 ease-apple"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-[13px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="size-4" />
                  {teamSize} {teamSize === 1 ? "miembro" : "miembros"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  {formatDate(project.deadline)}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-hairline pt-4">
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => setDetails(project)}>
                  Ver detalles
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Editar ${project.name}`}
                  onClick={() => setEditing(project)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Eliminar ${project.name}`}
                  onClick={() => setRemoving(project)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {details && (
        <ProjectDetails project={details} open onOpenChange={(open) => !open && setDetails(null)} />
      )}
      {editing && (
        <ProjectForm project={editing} open onOpenChange={(open) => !open && setEditing(null)} />
      )}
      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        title="¿Eliminar proyecto?"
        description={`"${removing?.name}" se eliminará junto con sus tareas y sus miembros quedarán sin proyecto. No se puede deshacer.`}
        onConfirm={() => deleteProject(removing!.id)}
      />
    </>
  )
}
