import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-br-secondary focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-br-accent text-white shadow-br-accent hover:bg-[#EA580C] hover:-translate-y-0.5 hover:shadow-br-accent-hover active:translate-y-0 active:shadow-br-accent rounded-[var(--radius-md)]",
        destructive:
          "bg-br-error text-white shadow-br-sm hover:bg-br-error/90 focus-visible:ring-br-error/20",
        outline:
          "border border-br-border bg-br-surface shadow-br-sm hover:bg-br-hover hover:text-br-dark dark:bg-br-dark/30 dark:border-br-border dark:hover:bg-br-dark/50 rounded-[var(--radius-md)]",
        secondary:
          "bg-br-primary text-white shadow-br-sm hover:bg-[#152D4A] rounded-[var(--radius-md)]",
        ghost:
          "bg-transparent border border-br-border text-br-dark hover:border-br-text hover:bg-br-hover dark:text-br-light dark:hover:bg-white/5 dark:border-white/20 dark:hover:border-white/40 rounded-[var(--radius-md)]",
        link: "text-br-primary underline-offset-4 hover:underline hover:text-br-secondary",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3 text-sm",
        sm: "h-8 rounded-[var(--radius-sm)] gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-11 rounded-[var(--radius-lg)] px-6 has-[>svg]:px-4 text-base",
        xl: "h-12 rounded-[var(--radius-lg)] px-8 has-[>svg]:px-6 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }