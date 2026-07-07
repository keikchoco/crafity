import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const sectionVariants = cva("py-16 md:py-24", {
  variants: {
    background: {
      none: "",
      muted: "bg-muted/50",
      card: "bg-card",
    },
  },
  defaultVariants: {
    background: "none",
  },
})

interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: React.ElementType
}

function Section({ className, background = "none", as: Component = "section", ...props }: SectionProps) {
  return (
    <Component
      data-slot="section"
      className={cn(sectionVariants({ background, className }))}
      {...props}
    />
  )
}

export { Section, sectionVariants }
