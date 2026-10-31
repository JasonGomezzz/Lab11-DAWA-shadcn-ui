"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { SectionHeader } from "@/components/SectionHeader"
import { TaskForm } from "@/components/TaskForm"
import { formatDate } from "@/lib/date"
import { useDashboard } from "@/lib/store"
import { priorityTone, taskStatusTone } from "@/lib/ui"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"

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
    <>
      <SectionHeader
        title={`${tasks.length} ${tasks.length === 1 ? "tarea" : "tareas"}`}
        description="Marca lo terminado con el círculo; edita o elimina desde cada fila."
        action={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Nueva tarea
          </Button>
        }
      />

      <Card className="animate-tile gap-0 overflow-hidden p-0">
        <Table>
          <TableCaption className="mt-0 border-t border-hairline py-3 text-[13px]">
            Mostrando {visible.length} de {tasks.length} tareas
          </TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-14 pl-6">Hecha</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Asignado a</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead className="pr-6 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                  No hay tareas registradas.
                </TableCell>
              </TableRow>
            )}
            {visible.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="pl-6">
                  {togglingId === task.id ? (
                    <Spinner className="size-[22px] text-primary" />
                  ) : (
                    <Checkbox
                      aria-label={`Marcar "${task.description}" como completada`}
                      checked={task.status === "Completado"}
                      onCheckedChange={(checked) => toggleDone(task, checked === true)}
                    />
                  )}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-[15px] font-medium transition-colors",
                    task.status === "Completado" && "text-muted-foreground line-through decoration-muted-foreground/40"
                  )}
                >
                  {task.description}
                </TableCell>
                <TableCell className="text-[15px] text-muted-foreground">{projectName(task.projectId)}</TableCell>
                <TableCell>
                  <Badge variant={taskStatusTone[task.status]}>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityTone[task.priority]}>{task.priority}</Badge>
                </TableCell>
                <TableCell className="text-[15px]">{memberName(task.userId)}</TableCell>
                <TableCell className="text-[15px] text-muted-foreground">{formatDate(task.dateline)}</TableCell>
                <TableCell className="pr-6 text-right">
                  <Button size="icon-sm" variant="ghost" aria-label="Editar tarea" onClick={() => setEditing(task)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Eliminar tarea"
                    onClick={() => setRemoving(task)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={current === 1}
                className={current === 1 ? "pointer-events-none opacity-40" : ""}
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
                className={current === totalPages ? "pointer-events-none opacity-40" : ""}
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
        title="¿Eliminar tarea?"
        description={`"${removing?.description}" se eliminará. No se puede deshacer.`}
        onConfirm={() => deleteTask(removing!.id)}
      />
    </>
  )
}
