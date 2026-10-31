"use client"

import { useState } from "react"
import { Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { ProjectDetails } from "@/components/ProjectDetails"
import { ProjectForm } from "@/components/ProjectForm"
import { formatDate } from "@/lib/date"
import { useDashboard } from "@/lib/store"
import type { Project } from "@/lib/types"

export function ProjectsTab() {
  const { projects, members, projectProgress, deleteProject } = useDashboard()
  const [details, setDetails] = useState<Project | null>(null)
  const [editing, setEditing] = useState<Project | null>(null)
  const [removing, setRemoving] = useState<Project | null>(null)

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No hay proyectos. Crea uno con el botón &quot;Nuevo Proyecto&quot;.
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const progress = projectProgress(project.id)
          const teamSize = members.filter((m) => m.projectId === project.id).length
          return (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      project.status === "Completado"
                        ? "default"
                        : project.status === "En revisión"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {teamSize} {teamSize === 1 ? "miembro" : "miembros"}
                    </span>
                    <span>{formatDate(project.deadline)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setDetails(project)}>
                      Ver detalles
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(project)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setRemoving(project)}>
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
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
        title="Eliminar proyecto"
        description={`Se eliminará "${removing?.name}" junto con sus tareas, y sus miembros quedarán sin proyecto. Esta acción no se puede deshacer.`}
        onConfirm={() => deleteProject(removing!.id)}
      />
    </>
  )
}
