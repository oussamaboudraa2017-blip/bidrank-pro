import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--radius-sm)] border px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-br-accent text-white uppercase tracking-wide [a&]:hover:bg-br-accent/90",
        secondary:
          "border-transparent bg-br-primary/8 text-br-primary [a&]:hover:bg-br-primary/15",
        destructive:
          "border-transparent bg-br-error text-white [a&]:hover:bg-br-error/90",
        outline:
          "border-br-border text-br-dark [a&]:hover:bg-br-hover",
        popular:
          "border-transparent bg-br-accent text-white uppercase tracking-wider text-[0.75rem] px-4 py-1 rounded-full font-bold",
        certification:
          "border-br-primary/15 bg-br-primary/8 text-br-primary rounded-[var(--radius-sm)] font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }