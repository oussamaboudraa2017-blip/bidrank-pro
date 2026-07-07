import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-br-text-secondary selection:bg-br-secondary selection:text-white border-br-border flex h-11 w-full min-w-0 rounded-[var(--radius-lg)] border bg-br-surface px-4 py-3 text-base shadow-br-sm transition-[color,box-shadow,border-color] duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-br-secondary focus-visible:ring-2 focus-visible:ring-br-secondary/20",
        "aria-invalid:ring-br-error/20 aria-invalid:border-br-error",
        className
      )}
      {...props}
    />
  )
}

export { Input }