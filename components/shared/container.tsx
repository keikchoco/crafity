import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const containerVariants = cva("mx-auto w-full px-4 md:px-6 lg:px-8", {
  variants: {
    size: {
      lg: "max-w-[1440px]",
      default: "max-w-[1280px]",
      sm: "max-w-[768px]",
      full: "max-w-none",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType
}

function Container({ className, size = "default", as: Component = "div", ...props }: ContainerProps) {
  return (
    <Component
      data-slot="container"
      className={cn(containerVariants({ size, className }))}
      {...props}
    />
  )
}

export { Container, containerVariants }
