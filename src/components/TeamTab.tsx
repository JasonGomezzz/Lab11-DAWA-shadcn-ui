"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { MemberForm } from "@/components/MemberForm"
import { SectionHeader } from "@/components/SectionHeader"
import { UserAvatar } from "@/components/UserAvatar"
import { formatDate } from "@/lib/date"
import { useDashboard } from "@/lib/store"
import { cn } from "@/lib/utils"
import type { Member } from "@/lib/types"

export function TeamTab() {
  const { members, projects, deleteMember } = useDashboard()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [removing, setRemoving] = useState<Member | null>(null)

  const projectName = (id: string) => projects.find((p) => p.id === id)?.name

  return (
    <>
      <SectionHeader
        title={`${members.length} ${members.length === 1 ? "persona" : "personas"}`}
        description="Gestiona los miembros del equipo y sus roles."
        action={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Nuevo miembro
          </Button>
        }
      />

      <Card className="animate-tile gap-0 p-0">
        {members.length === 0 ? (
          <p className="py-16 text-center text-[15px] text-muted-foreground">No hay miembros registrados.</p>
        ) : (
          <ul className="divide-y divide-hairline">
            {members.map((member) => {
              const project = projectName(member.projectId)
              return (
                <li
                  key={member.userId}
                  className="flex flex-wrap items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-muted/50 sm:px-6"
                >
                  <UserAvatar name={member.name} className="size-12 text-base" />
                  <div className="min-w-0 flex-1 basis-56">
                    <p className="flex items-center gap-2 text-[17px] leading-tight font-semibold tracking-[-0.01em]">
                      {member.name}
                      <span className="text-xs font-normal text-muted-foreground">{member.userId}</span>
                    </p>
                    <p className="mt-0.5 text-[15px] text-muted-foreground">{member.position}</p>
                    <p className="mt-1 truncate text-[13px] text-muted-foreground">
                      {member.email} · {member.phone} · Nac. {formatDate(member.birthdate)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {project && <Badge variant="default">{project}</Badge>}
                    <Badge variant="secondary">{member.role}</Badge>
                    <span
                      className={cn(
                        "flex items-center gap-1.5 text-[13px]",
                        member.isActive ? "text-success-foreground" : "text-muted-foreground"
                      )}
                    >
                      <span
                        className={cn("size-2 rounded-full", member.isActive ? "bg-success" : "bg-muted-foreground/40")}
                      />
                      {member.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Editar a ${member.name}`}
                      onClick={() => setEditing(member)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Eliminar a ${member.name}`}
                      onClick={() => setRemoving(member)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      {creating && <MemberForm open onOpenChange={setCreating} />}
      {editing && <MemberForm member={editing} open onOpenChange={(open) => !open && setEditing(null)} />}
      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        title="¿Eliminar miembro?"
        description={`${removing?.name} saldrá del equipo y sus tareas quedarán sin asignar.`}
        onConfirm={() => deleteMember(removing!.userId)}
      />
    </>
  )
}
