"use client"

import { UserAvatar } from "@/components/UserAvatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDate } from "@/lib/date"
import { useDashboard } from "@/lib/store"
import { priorityTone, projectStatusTone, taskStatusTone } from "@/lib/ui"
import type { Project } from "@/lib/types"

interface ProjectDetailsProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectDetails({ project, open, onOpenChange }: ProjectDetailsProps) {
  const { members, tasks, projectProgress } = useDashboard()
  const team = members.filter((m) => m.projectId === project.id)
  const projectTasks = tasks.filter((t) => t.projectId === project.id)
  const progress = projectProgress(project.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project.name}</DialogTitle>
          <DialogDescription>{project.description || "Sin descripción"}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant={projectStatusTone[project.status]}>{project.status}</Badge>
            <Badge variant="secondary">{project.category}</Badge>
            <Badge variant={priorityTone[project.priority]}>
              Prioridad {project.priority}
            </Badge>
          </div>

          <p>
            <span className="text-muted-foreground">Fecha límite: </span>
            <span className="font-medium">{formatDate(project.deadline)}</span>
          </p>

          <div>
            <div className="mb-2 flex justify-between">
              <span className="text-muted-foreground">Progreso (tareas completadas)</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Equipo ({team.length})</h4>
            {team.length === 0 ? (
              <p className="text-muted-foreground">Sin miembros asignados.</p>
            ) : (
              <div className="grid gap-2">
                {team.map((m) => (
                  <div key={m.userId} className="flex items-center gap-3">
                    <UserAvatar name={m.name} className="size-9" />
                    <div>
                      <p className="font-medium leading-none">{m.name}</p>
                      <p className="text-muted-foreground">{m.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-2 font-medium">Tareas ({projectTasks.length})</h4>
            {projectTasks.length === 0 ? (
              <p className="text-muted-foreground">Este proyecto no tiene tareas.</p>
            ) : (
              <ul className="grid gap-2">
                {projectTasks.map((t) => (
                  <li key={t.id} className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2.5">
                    <span>{t.description}</span>
                    <Badge variant={taskStatusTone[t.status]}>{t.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
