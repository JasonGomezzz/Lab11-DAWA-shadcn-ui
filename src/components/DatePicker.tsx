"use client"

import { useState } from "react"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatDate, fromISO, toISO } from "@/lib/date"

interface DatePickerProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** Muestra selectores de mes y año (útil para fechas de nacimiento). */
  withDropdowns?: boolean
}

export function DatePicker({ id, value, onChange, placeholder = "Selecciona una fecha", withDropdowns }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected = fromISO(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button id={id} type="button" variant="secondary" className="h-11 w-full justify-start rounded-xl bg-muted px-3.5 text-[15px] font-normal hover:bg-[color-mix(in_srgb,var(--muted),var(--foreground)_4%)]">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? formatDate(value) : <span className="text-muted-foreground">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto rounded-2xl p-0" align="start">
        <Calendar
          mode="single"
          locale={es}
          selected={selected}
          defaultMonth={selected}
          captionLayout={withDropdowns ? "dropdown" : "label"}
          startMonth={new Date(1950, 0)}
          endMonth={new Date(2035, 11)}
          onSelect={(date) => {
            if (date) {
              onChange(toISO(date))
              setOpen(false)
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
