"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { TaskForm } from "@/components/TaskForm"
import { formatDate } from "@/lib/date"
import { useDashboard } from "@/lib/store"
import type { Task } from "@/lib/types"

const statusVariant = (status: string) => {
  switch (status) {
    case "Completado":
      return "default"
    case "En progreso":
      return "secondary"
    default:
      return "outline"
  }
}

const priorityVariant = (priority: string) => {
  switch (priority) {
    case "Urgente":
      return "destructive"
    case "Alta":
      return "default"
    case "Media":
      return "secondary"
    default:
      return "outline"
  }
}

// Páginas a mostrar: primera, última y las cercanas a la actual, con "..." en los saltos.
function pageItems(current: number, total: number): (number | "gap-start" | "gap-end")[] {
  const pages = Array.from({ length: total }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === total || Math.abs(p - current) <= 1
  )
  const items: (number | "gap-start" | "gap-end")[] = []
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) items.push(p < current ? "gap-start" : "gap-end")
    items.push(p)
  })
  return items
}

export function TasksTable() {
  const { tasks, projects, members, settings, updateTask, deleteTask } = useDashboard()
  const [page, setPage] = useState(1)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [removing, setRemoving] = useState<Task | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const pageSize = Number(settings.itemsPerPage)
  const totalPages = Math.max(1, Math.ceil(tasks.length / pageSize))
  const current = Math.min(page, totalPages)
  const visible = tasks.slice((current - 1) * pageSize, current * pageSize)

  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? "—"
  const memberName = (id: string) => members.find((m) => m.userId === id)?.name ?? "Sin asignar"

  const toggleDone = async (task: Task, done: boolean) => {
    setTogglingId(task.id)
    const { id, ...rest } = task
    await updateTask(id, { ...rest, status: done ? "Completado" : "Pendiente" })
    setTogglingId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>
            Mostrando {visible.length} de {tasks.length} tareas
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Hecha</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Asignado a</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                  No hay tareas registradas.
                </TableCell>
              </TableRow>
            )}
            {visible.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  {togglingId === task.id ? (
                    <Spinner />
                  ) : (
                    <Checkbox
                      aria-label={`Marcar "${task.description}" como completada`}
                      checked={task.status === "Completado"}
                      onCheckedChange={(checked) => toggleDone(task, checked === true)}
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">{task.description}</TableCell>
                <TableCell>{projectName(task.projectId)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                </TableCell>
                <TableCell>{memberName(task.userId)}</TableCell>
                <TableCell>{formatDate(task.dateline)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(task)}>
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setRemoving(task)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={current === 1}
                className={current === 1 ? "pointer-events-none opacity-50" : ""}
                onClick={(e) => {
                  e.preventDefault()
                  setPage(current - 1)
                }}
              />
            </PaginationItem>
            {pageItems(current, totalPages).map((item) =>
              typeof item === "number" ? (
                <PaginationItem key={item}>
                  <PaginationLink
                    href="#"
                    isActive={item === current}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(item)
                    }}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={current === totalPages}
                className={current === totalPages ? "pointer-events-none opacity-50" : ""}
                onClick={(e) => {
                  e.preventDefault()
                  setPage(current + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {creating && <TaskForm open onOpenChange={setCreating} />}
      {editing && <TaskForm task={editing} open onOpenChange={(open) => !open && setEditing(null)} />}
      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        title="Eliminar tarea"
        description={`Se eliminará la tarea "${removing?.description}". Esta acción no se puede deshacer.`}
        onConfirm={() => deleteTask(removing!.id)}
      />
    </div>
  )
}
