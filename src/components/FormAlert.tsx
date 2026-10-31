import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function FormAlert({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null
  return (
    <Alert variant="destructive">
      <AlertCircle />
      <AlertTitle>Revisa el formulario</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-4">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
