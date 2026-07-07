import * as React from "react"
import { TriangleAlertIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface FormErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string | null
}

function FormError({ message, className, ...props }: FormErrorProps) {
  if (!message) {
    return null
  }

  return (
    <div
      data-slot="form-error"
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive",
        className,
      )}
      {...props}
    >
      <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

export { FormError }
