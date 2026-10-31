import { format, parse, isValid } from "date-fns"
import { es } from "date-fns/locale"

export function toISO(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function fromISO(value: string): Date | undefined {
  if (!value) return undefined
  const date = parse(value, "yyyy-MM-dd", new Date())
  return isValid(date) ? date : undefined
}

export function formatDate(value: string): string {
  const date = fromISO(value)
  return date ? format(date, "d 'de' MMMM yyyy", { locale: es }) : "—"
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
