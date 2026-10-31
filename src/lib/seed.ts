import type { Member, Project, Settings, Task } from "./types"

export const seedProjects: Project[] = [
  { id: "p1", name: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", category: "Desarrollo Web", priority: "Alta", status: "En progreso", deadline: "2026-12-15" },
  { id: "p2", name: "Mobile App", description: "Aplicación móvil con React Native", category: "Desarrollo Mobile", priority: "Media", status: "En revisión", deadline: "2026-11-30" },
  { id: "p3", name: "Dashboard Analytics", description: "Panel de análisis con visualizaciones", category: "Desarrollo Web", priority: "Baja", status: "Planificado", deadline: "2027-01-20" },
  { id: "p4", name: "API Gateway", description: "Microservicios con Node.js", category: "Desarrollo Web", priority: "Alta", status: "En progreso", deadline: "2026-12-05" },
  { id: "p5", name: "Design System", description: "Librería de componentes reutilizables", category: "Diseño", priority: "Media", status: "Completado", deadline: "2026-10-20" },
  { id: "p6", name: "Marketing Website", description: "Sitio web institucional", category: "Marketing", priority: "Baja", status: "En progreso", deadline: "2026-12-28" },
]

export const seedMembers: Member[] = [
  { userId: "u1", role: "Editor", name: "María García", email: "maria@example.com", position: "Frontend Developer", birthdate: "1996-03-14", phone: "987654321", projectId: "p1", isActive: true },
  { userId: "u2", role: "Editor", name: "Juan Pérez", email: "juan@example.com", position: "Backend Developer", birthdate: "1994-07-02", phone: "987654322", projectId: "p1", isActive: true },
  { userId: "u3", role: "Miembro", name: "Ana López", email: "ana@example.com", position: "UI/UX Designer", birthdate: "1998-11-25", phone: "987654323", projectId: "p2", isActive: false },
  { userId: "u4", role: "Admin", name: "Carlos Ruiz", email: "carlos@example.com", position: "DevOps Engineer", birthdate: "1991-01-09", phone: "987654324", projectId: "p4", isActive: true },
  { userId: "u5", role: "Admin", name: "Laura Martínez", email: "laura@example.com", position: "Project Manager", birthdate: "1990-05-30", phone: "987654325", projectId: "p4", isActive: true },
]

export const seedTasks: Task[] = [
  { id: "t1", description: "Implementar autenticación", projectId: "p1", status: "En progreso", priority: "Alta", userId: "u1", dateline: "2026-11-15" },
  { id: "t2", description: "Diseñar pantalla de perfil", projectId: "p2", status: "Pendiente", priority: "Media", userId: "u3", dateline: "2026-11-20" },
  { id: "t3", description: "Configurar CI/CD", projectId: "p4", status: "Completado", priority: "Alta", userId: "u4", dateline: "2026-11-10" },
  { id: "t4", description: "Optimizar queries SQL", projectId: "p1", status: "En progreso", priority: "Urgente", userId: "u2", dateline: "2026-11-12" },
  { id: "t5", description: "Documentar API endpoints", projectId: "p4", status: "Pendiente", priority: "Baja", userId: "u5", dateline: "2026-11-25" },
  { id: "t6", description: "Crear catálogo de productos", projectId: "p1", status: "Completado", priority: "Media", userId: "u1", dateline: "2026-11-05" },
  { id: "t7", description: "Pruebas en dispositivos iOS", projectId: "p2", status: "En progreso", priority: "Alta", userId: "u3", dateline: "2026-11-18" },
  { id: "t8", description: "Definir paleta de colores", projectId: "p5", status: "Completado", priority: "Baja", userId: "u3", dateline: "2026-10-18" },
  { id: "t9", description: "Landing page de campaña", projectId: "p6", status: "Pendiente", priority: "Media", userId: "", dateline: "2026-12-01" },
  { id: "t10", description: "Rate limiting en el gateway", projectId: "p4", status: "En progreso", priority: "Urgente", userId: "u4", dateline: "2026-11-22" },
  { id: "t11", description: "Integrar pasarela de pagos", projectId: "p1", status: "Pendiente", priority: "Alta", userId: "u2", dateline: "2026-12-02" },
  { id: "t12", description: "Wireframes del panel", projectId: "p3", status: "Pendiente", priority: "Baja", userId: "", dateline: "2026-12-10" },
]

export const seedSettings: Settings = {
  orgName: "Mi Organización",
  contactEmail: "contacto@example.com",
  language: "es",
  itemsPerPage: "5",
  notifyTasks: true,
  notifyEmail: false,
  weeklyReport: true,
}
