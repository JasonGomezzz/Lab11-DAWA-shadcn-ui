"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
import {
  CATEGORIES,
  PRIORITIES,
  PROJECT_STATUSES,
  type Priority,
  type Project,
  type ProjectStatus,
} from "@/lib/types"

interface ProjectFormProps {
  /** Si se pasa, el formulario edita ese proyecto; si no, crea uno nuevo. */
  project?: Project
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ProjectForm({ project, open: openProp, onOpenChange }: ProjectFormProps) {
  const [innerOpen, setInnerOpen] = useState(false)
  const controlled = openProp !== undefined
  const open = controlled ? openProp : innerOpen
  const setOpen = controlled ? onOpenChange! : setInnerOpen

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!controlled && (
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Nuevo Proyecto
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <ProjectFormBody project={project} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

function ProjectFormBody({ project, onDone }: { project?: Project; onDone: () => void }) {
  const { members, addProject, updateProject } = useDashboard()
  const [name, setName] = useState(project?.name ?? "")
  const [description, setDescription] = useState(project?.description ?? "")
  const [category, setCategory] = useState(project?.category ?? "")
  const [priority, setPriority] = useState<Priority | "">(project?.priority ?? "")
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? "Planificado")
  const [deadline, setDeadline] = useState(project?.deadline ?? "")
  const [memberIds, setMemberIds] = useState<string[]>(
    project ? members.filter((m) => m.projectId === project.id).map((m) => m.userId) : []
  )
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const toggleMember = (userId: string, checked: boolean) =>
    setMemberIds((prev) => (checked ? [...prev, userId] : prev.filter((id) => id !== userId)))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found: string[] = []
    if (!name.trim()) found.push("El nombre del proyecto es obligatorio.")
    if (!category) found.push("Selecciona una categoría.")
    if (!priority) found.push("Selecciona la prioridad.")
    if (!deadline) found.push("Selecciona la fecha límite.")
    setErrors(found)
    if (found.length > 0) return

    const data = {
      name: name.trim(),
      description: description.trim(),
      category,
      priority: priority as Priority,
      status,
      deadline,
    }
    setSaving(true)
    if (project) await updateProject(project.id, data, memberIds)
    else await addProject(data, memberIds)
    setSaving(false)
    onDone()
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{project ? "Editar Proyecto" : "Crear Nuevo Proyecto"}</DialogTitle>
        <DialogDescription>
          Completa la información del proyecto. Click en guardar cuando termines.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <FormAlert errors={errors} />

        <div className="grid gap-2">
          <Label htmlFor="name">
            Nombre del Proyecto <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Mi Proyecto Increíble"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            placeholder="Breve descripción del proyecto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="category">
              Categoría <span className="text-red-500">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority">
              Prioridad <span className="text-red-500">*</span>
            </Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger id="priority" className="w-full">
                <SelectValue placeholder="Selecciona la prioridad" />
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

          <div className="grid gap-2">
            <Label htmlFor="status">Estado</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="deadline">
              Fecha límite <span className="text-red-500">*</span>
            </Label>
            <DatePicker id="deadline" value={deadline} onChange={setDeadline} />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Miembros del equipo</Label>
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay miembros registrados.</p>
          ) : (
            <div className="grid max-h-40 gap-2 overflow-y-auto rounded-md border p-3">
              {members.map((m) => (
                <label key={m.userId} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={memberIds.includes(m.userId)}
                    onCheckedChange={(checked) => toggleMember(m.userId, checked === true)}
                  />
                  <span className="font-medium">{m.name}</span>
                  <span className="text-muted-foreground">· {m.position}</span>
                </label>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Un miembro pertenece a un solo proyecto: al asignarlo aquí se mueve desde su proyecto actual.
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" disabled={saving} onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Spinner />}
          {project ? "Guardar Cambios" : "Crear Proyecto"}
        </Button>
      </DialogFooter>
    </form>
  )
}
