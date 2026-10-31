# next-shadcn-ui

Laboratorio 11 (Ejercicio 2): dashboard de proyectos con **shadcn/ui** sobre Next.js (App Router, TypeScript, Tailwind CSS v4, Turbopack).

## Requisitos

- Node.js 18.18 o superior

## Instalación y ejecución

```bash
npm install
npm run dev
```

Dashboard: http://localhost:3000/dashboard

Otros scripts: `npm run build`, `npm run start`, `npm run lint`.

## Estructura

```
src/
├── app/dashboard/page.tsx      # Dashboard con pestañas
├── components/
│   ├── OverviewTab.tsx         # Métricas y actividad (datos en memoria)
│   ├── ProjectsTab.tsx         # Lista, detalle, edición y eliminación
│   ├── ProjectForm.tsx         # Crear/editar proyecto (con miembros)
│   ├── ProjectDetails.tsx
│   ├── TeamTab.tsx             # CRUD de miembros
│   ├── MemberForm.tsx
│   ├── TasksTable.tsx          # CRUD de tareas con paginación
│   ├── TaskForm.tsx
│   ├── SettingsTab.tsx         # Configuración simulada
│   ├── DatePicker.tsx          # Popover + Calendar
│   ├── FormAlert.tsx           # Alert de validaciones
│   ├── ConfirmDialog.tsx
│   └── ui/                     # Componentes de shadcn/ui (código propio)
└── lib/
    ├── store.tsx               # Estado en memoria (contexto) con CRUD simulado
    ├── seed.ts                 # Datos iniciales
    ├── types.ts, date.ts, utils.ts
```

## Funcionalidades

Los datos viven en memoria (se reinician al recargar). Cada operación simula una petición con 700 ms de retardo y muestra un `Spinner`.

| Pestaña | Qué hace |
|---|---|
| Resumen | Métricas calculadas con los datos actuales y registro de actividad de la sesión |
| Proyectos | Crear (con campo de miembros del equipo), ver detalles, editar y eliminar |
| Equipo | CRUD con `userId`, `role`, `name`, `email`, `position`, `birthdate`, `phone`, `projectId`, `isActive` |
| Tareas | CRUD con `description`, `projectId`, `status`, `priority`, `userId`, `dateline`; paginación; checkbox para completar |
| Configuración | Formulario con nombre de organización, email, idioma, tareas por página y notificaciones |

Componentes de shadcn/ui usados: button, card, input, textarea, label, dialog, tabs, select, badge, avatar, switch, table, checkbox, popover, **spinner**, **alert**, **calendar** y **pagination**. El tema cambió de neutro a índigo en `globals.css`.

Reglas de datos: un miembro pertenece a un solo proyecto; al eliminar un proyecto se borran sus tareas y sus miembros quedan sin proyecto; al eliminar un miembro sus tareas quedan sin asignar. "Tareas por página" de Configuración controla la paginación de Tareas.

## Desviaciones respecto al enunciado

- El enunciado muestra `TaskTable`/`ProjectForm` con datos fijos; se reemplazaron por versiones conectadas al estado en memoria para cumplir la TAREA.
- La CLI actual de `shadcn` ya no pregunta el color base: se inicializó con `--base radix --preset nova` (base color `neutral`, no Slate). Se usa Radix porque el código del lab emplea `asChild`.
- `shadcn add form` no instala nada en este preset; el código del lab no usa `Form`.
- El archivo del componente de tabla se llama `TasksTable.tsx` para coincidir con el `import` del enunciado (el título decía `TaskTable.tsx`).
- `init` dejó `--font-sans: var(--font-sans)` en `globals.css` (referencia circular que mostraba la fuente serif); ahora apunta a `--font-geist-sans`.
- `bg-gradient-to-br` pasa a `bg-linear-to-br` (Tailwind v4) y se quitó el import sin uso de `AvatarImage`.
