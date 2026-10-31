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
│   ├── ProjectForm.tsx         # Diálogo para crear proyectos
│   ├── TasksTable.tsx          # Tabla de tareas
│   └── ui/                     # Componentes de shadcn/ui (código propio)
└── lib/utils.ts
```

Componentes de shadcn/ui instalados: button, card, input, label, dialog, tabs, select, badge, avatar, switch, table y checkbox.

## Pestañas del dashboard

Resumen, Proyectos, Equipo, Tareas y Configuración.

## Desviaciones respecto al enunciado

- La CLI actual de `shadcn` ya no pregunta el color base: se inicializó con `--base radix --preset nova` (base color `neutral`, no Slate). Se usa Radix porque el código del lab emplea `asChild`.
- `shadcn add form` no instala nada en este preset; el código del lab no usa `Form`.
- El archivo del componente de tabla se llama `TasksTable.tsx` para coincidir con el `import` del enunciado (el título decía `TaskTable.tsx`).
- `init` dejó `--font-sans: var(--font-sans)` en `globals.css` (referencia circular que mostraba la fuente serif); ahora apunta a `--font-geist-sans`.
- `bg-gradient-to-br` pasa a `bg-linear-to-br` (Tailwind v4) y se quitó el import sin uso de `AvatarImage`.
