"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { MemberForm } from "@/components/MemberForm"
import { formatDate } from "@/lib/date"
import { useDashboard } from "@/lib/store"
import type { Member } from "@/lib/types"

export function TeamTab() {
  const { members, projects, deleteMember } = useDashboard()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [removing, setRemoving] = useState<Member | null>(null)

  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? "Sin proyecto"

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle>Miembros del Equipo</CardTitle>
          <CardDescription>Gestiona los miembros de tu equipo y sus roles</CardDescription>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Miembro
        </Button>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">No hay miembros registrados.</p>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.userId}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {member.name} <span className="text-xs text-muted-foreground">({member.userId})</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.email} · {member.phone} · Nac. {formatDate(member.birthdate)}
                    </p>
                    <p className="text-xs text-muted-foreground">Proyecto: {projectName(member.projectId)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{member.role}</Badge>
                  <Badge variant={member.isActive ? "default" : "secondary"}>
                    {member.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => setEditing(member)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setRemoving(member)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {creating && <MemberForm open onOpenChange={setCreating} />}
      {editing && <MemberForm member={editing} open onOpenChange={(open) => !open && setEditing(null)} />}
      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        title="Eliminar miembro"
        description={`Se eliminará a ${removing?.name}. Sus tareas quedarán sin asignar.`}
        onConfirm={() => deleteMember(removing!.userId)}
      />
    </Card>
  )
}
