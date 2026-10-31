"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/DatePicker"
import { FormAlert } from "@/components/FormAlert"
import { useDashboard } from "@/lib/store"
import { PRIORITIES, TASK_STATUSES, type Priority, type Task, type TaskStatus } from "@/lib/types"

const UNASSIGNED = "none"

interface TaskFormProps {
  /** Si se pasa, edita esa tarea; si no, crea una nueva. */
  task?: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskForm({ task, open, onOpenChange }: TaskFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <TaskFormBody task={task} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function TaskFormBody({ task, onDone }: { task?: Task; onDone: () => void }) {
  const { projects, members, addTask, updateTask } = useDashboard()
  const [description, setDescription] = useState(task?.description ?? "")
  const [projectId, setProjectId] = useState(task?.projectId ?? "")
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "Pendiente")
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "Media")
  const [userId, setUserId] = useState(task?.userId || UNASSIGNED)
  const [dateline, setDateline] = useState(task?.dateline ?? "")
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found: string[] = []
    if (!description.trim()) found.push("La descripción es obligatoria.")
    if (!projectId) found.push("Selecciona un proyecto.")
    if (!dateline) found.push("Selecciona la fecha límite.")
    setErrors(found)
    if (found.length > 0) return

    const data = {
      description: description.trim(),
      projectId,
      status,
      priority,
      userId: userId === UNASSIGNED ? "" : userId,
      dateline,
    }
    setSaving(true)
    if (task) await updateTask(task.id, data)
    else await addTask(data)
    setSaving(false)
    onDone()
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{task ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
        <DialogDescription>Completa los datos de la tarea.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <FormAlert errors={errors} />

        <div className="grid gap-2">
          <Label htmlFor="t-description">
            Descripción <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="t-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="¿Qué hay que hacer?"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="t-project">
              Proyecto <span className="text-red-500">*</span>
            </Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger id="t-project" className="w-full">
                <SelectValue placeholder="Selecciona un proyecto" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="t-user">Asignado a</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger id="t-user" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UNASSIGNED}>Sin asignar</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.userId} value={m.userId}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="t-status">Estado</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
              <SelectTrigger id="t-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="t-priority">Prioridad</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger id="t-priority" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="t-dateline">
            Fecha límite <span className="text-red-500">*</span>
          </Label>
          <DatePicker id="t-dateline" value={dateline} onChange={setDateline} />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" disabled={saving} onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Spinner />}
          {task ? "Guardar Cambios" : "Crear Tarea"}
        </Button>
      </DialogFooter>
    </form>
  )
}
