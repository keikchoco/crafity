import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const stackVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      column: "flex-col",
    },
    gap: {
      xs: "gap-1",
      sm: "gap-2",
      default: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
  },
  defaultVariants: {
    direction: "column",
    gap: "default",
    align: "stretch",
    justify: "start",
    wrap: false,
  },
})

interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  as?: React.ElementType
}

function Stack({
  className,
  direction,
  gap,
  align,
  justify,
  wrap,
  as: Component = "div",
  ...props
}: StackProps) {
  return (
    <Component
      data-slot="stack"
      className={cn(stackVariants({ direction, gap, align, justify, wrap, className }))}
      {...props}
    />
  )
}

export { Stack, stackVariants }
