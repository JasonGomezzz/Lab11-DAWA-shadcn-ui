"use client"

import * as React from "react"
import { cn } from "cn"
import { Switch as SwitchPrimitive } from "radix-ui"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none group-has-[:focus-visible]/field-label:border-transparent group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-4 focus-visible:ring-primary/25 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[31px] data-[size=default]:w-[51px] data-[size=sm]:h-[24px] data-[size=sm]:w-[40px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-success data-unchecked:bg-black/[0.12] dark:data-unchecked:bg-white/20 duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-white shadow-[0_2px_4px_rgb(0_0_0/0.25)] ring-0 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-[size=default]/switch:size-[27px] group-data-[size=sm]/switch:size-5 group-data-[size=default]/switch:translate-x-0.5 group-data-[size=sm]/switch:translate-x-0.5 group-data-[size=default]/switch:data-checked:translate-x-[22px] group-data-[size=sm]/switch:data-checked:translate-x-[18px]"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
