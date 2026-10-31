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
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "@/components/DatePicker"
import { FormAlert } from "@/components/FormAlert"
import { isEmail } from "@/lib/date"
import { useDashboard } from "@/lib/store"
import { ROLES, type Member, type Role } from "@/lib/types"

const NO_PROJECT = "none"

interface MemberFormProps {
  /** Si se pasa, edita a ese miembro; si no, crea uno nuevo. */
  member?: Member
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MemberForm({ member, open, onOpenChange }: MemberFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <MemberFormBody member={member} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function MemberFormBody({ member, onDone }: { member?: Member; onDone: () => void }) {
  const { projects, addMember, updateMember } = useDashboard()
  const [name, setName] = useState(member?.name ?? "")
  const [email, setEmail] = useState(member?.email ?? "")
  const [role, setRole] = useState<Role>(member?.role ?? "Miembro")
  const [position, setPosition] = useState(member?.position ?? "")
  const [birthdate, setBirthdate] = useState(member?.birthdate ?? "")
  const [phone, setPhone] = useState(member?.phone ?? "")
  const [projectId, setProjectId] = useState(member?.projectId || NO_PROJECT)
  const [isActive, setIsActive] = useState(member?.isActive ?? true)
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found: string[] = []
    if (!name.trim()) found.push("El nombre es obligatorio.")
    if (!isEmail(email)) found.push("Ingresa un email válido.")
    if (!position.trim()) found.push("El cargo es obligatorio.")
    if (!birthdate) found.push("Selecciona la fecha de nacimiento.")
    if (!/^\d{9}$/.test(phone)) found.push("El teléfono debe tener 9 dígitos.")
    setErrors(found)
    if (found.length > 0) return

    const data = {
      name: name.trim(),
      email: email.trim(),
      role,
      position: position.trim(),
      birthdate,
      phone,
      projectId: projectId === NO_PROJECT ? "" : projectId,
      isActive,
    }
    setSaving(true)
    if (member) await updateMember(member.userId, data)
    else await addMember(data)
    setSaving(false)
    onDone()
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{member ? "Editar Miembro" : "Nuevo Miembro"}</DialogTitle>
        <DialogDescription>
          {member ? `ID de usuario: ${member.userId}` : "Se generará un ID de usuario automáticamente."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <FormAlert errors={errors} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="m-name">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input id="m-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="m-email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input id="m-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="m-position">
              Cargo <span className="text-red-500">*</span>
            </Label>
            <Input id="m-position" value={position} onChange={(e) => setPosition(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="m-phone">
              Teléfono <span className="text-red-500">*</span>
            </Label>
            <Input
              id="m-phone"
              inputMode="numeric"
              maxLength={9}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="m-birthdate">
              Fecha de nacimiento <span className="text-red-500">*</span>
            </Label>
            <DatePicker id="m-birthdate" value={birthdate} onChange={setBirthdate} withDropdowns />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="m-role">Rol</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger id="m-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="m-project">Proyecto</Label>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger id="m-project" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_PROJECT}>Sin proyecto</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Switch id="m-active" checked={isActive} onCheckedChange={setIsActive} />
          <Label htmlFor="m-active">Miembro activo</Label>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" disabled={saving} onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Spinner />}
          {member ? "Guardar Cambios" : "Agregar Miembro"}
        </Button>
      </DialogFooter>
    </form>
  )
}
