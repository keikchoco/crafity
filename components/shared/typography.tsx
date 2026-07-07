import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      display: "font-heading text-5xl leading-[1.05] font-semibold tracking-tight md:text-7xl",
      hero: "font-heading text-4xl leading-[1.1] font-semibold tracking-tight md:text-6xl",
      h1: "font-heading text-3xl leading-tight font-semibold tracking-tight md:text-4xl",
      h2: "font-heading text-2xl leading-tight font-semibold tracking-tight md:text-3xl",
      h3: "font-heading text-xl leading-snug font-medium md:text-2xl",
      "body-lg": "text-lg leading-relaxed text-muted-foreground",
      body: "text-base leading-relaxed text-muted-foreground",
      small: "text-sm leading-normal text-muted-foreground",
      caption: "text-xs leading-normal tracking-wide text-muted-foreground uppercase",
    },
  },
  defaultVariants: {
    variant: "body",
  },
})

const defaultTagForVariant: Record<
  NonNullable<VariantProps<typeof typographyVariants>["variant"]>,
  React.ElementType
> = {
  display: "h1",
  hero: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  "body-lg": "p",
  body: "p",
  small: "p",
  caption: "span",
}

interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType
}

function Typography({ className, variant = "body", as, ...props }: TypographyProps) {
  const Component = as ?? defaultTagForVariant[variant ?? "body"]

  return (
    <Component
      data-slot="typography"
      className={cn(typographyVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Typography, typographyVariants }
