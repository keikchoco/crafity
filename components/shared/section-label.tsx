import * as React from "react"

import { cn } from "@/lib/utils"

interface SectionLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: string
  children: React.ReactNode
}

function SectionLabel({ index, children, className, ...props }: SectionLabelProps) {
  return (
    <div
      data-slot="section-label"
      className={cn(
        "flex items-center gap-2.5 font-mono text-xs tracking-widest text-muted-foreground uppercase",
        className,
      )}
      {...props}
    >
      {index && <span className="text-primary">{index}</span>}
      <span className="h-px w-5 bg-border" />
      <span>{children}</span>
    </div>
  )
}

export { SectionLabel }
