"use client"

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { FormAlert } from "@/components/FormAlert"
import { SectionHeader } from "@/components/SectionHeader"
import { isEmail } from "@/lib/date"
import { useDashboard } from "@/lib/store"
import type { Settings } from "@/lib/types"

export function SettingsTab() {
  const { settings, saveSettings } = useDashboard()
  const [form, setForm] = useState<Settings>(settings)
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found: string[] = []
    if (!form.orgName.trim()) found.push("El nombre de la organización es obligatorio.")
    if (!isEmail(form.contactEmail)) found.push("Ingresa un email de contacto válido.")
    setErrors(found)
    setSaved(false)
    if (found.length > 0) return

    setSaving(true)
    await saveSettings({ ...form, orgName: form.orgName.trim() })
    setSaving(false)
    setSaved(true)
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto grid max-w-2xl gap-8">
      <FormAlert errors={errors} />
      {saved && (
        <Alert className="animate-panel">
          <CheckCircle2 />
          <AlertTitle>Configuración guardada</AlertTitle>
          <AlertDescription>Los cambios ya se aplican al dashboard.</AlertDescription>
        </Alert>
      )}

      <section>
        <SectionHeader title="General" description="Datos de tu organización y cómo se ve el dashboard." />
        <Card className="animate-tile gap-5 p-6">
          <div className="grid gap-2">
            <Label htmlFor="s-org">Nombre de la organización</Label>
            <Input id="s-org" value={form.orgName} onChange={(e) => update("orgName", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="s-email">Email de contacto</Label>
            <Input
              id="s-email"
              type="email"
              value={form.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="s-language">Idioma</Label>
              <Select value={form.language} onValueChange={(v) => update("language", v as Settings["language"])}>
                <SelectTrigger id="s-language" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="s-items">Tareas por página</Label>
              <Select
                value={form.itemsPerPage}
                onValueChange={(v) => update("itemsPerPage", v as Settings["itemsPerPage"])}
              >
                <SelectTrigger id="s-items" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </section>

      <section>
        <SectionHeader title="Notificaciones" description="Elige de qué quieres enterarte." />
        <Card className="animate-tile gap-0 p-0" style={{ ["--i" as string]: 1 }}>
          <div className="divide-y divide-hairline">
            <SwitchRow
              id="s-tasks"
              label="Nuevas tareas"
              description="Avisar cuando se asigne una tarea."
              checked={form.notifyTasks}
              onChange={(v) => update("notifyTasks", v)}
            />
            <SwitchRow
              id="s-mail"
              label="Correo electrónico"
              description="Enviar un correo por cada cambio importante."
              checked={form.notifyEmail}
              onChange={(v) => update("notifyEmail", v)}
            />
            <SwitchRow
              id="s-weekly"
              label="Reporte semanal"
              description="Resumen de avance cada lunes."
              checked={form.weeklyReport}
              onChange={(v) => update("weeklyReport", v)}
            />
          </div>
        </Card>
      </section>

      <div>
        <Button type="submit" size="lg" disabled={saving}>
          {saving && <Spinner />}
          Guardar configuración
        </Button>
      </div>
    </form>
  )
}

function SwitchRow(props: {
  id: string
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-4">
      <div>
        <Label htmlFor={props.id} className="text-[15px]">
          {props.label}
        </Label>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{props.description}</p>
      </div>
      <Switch id={props.id} checked={props.checked} onCheckedChange={props.onChange} />
    </div>
  )
}
