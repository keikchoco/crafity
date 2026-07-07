import * as React from "react"

import { Button } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"
import type { buttonVariants } from "@/components/ui/button"

interface SubmitButtonProps
  extends React.ComponentProps<typeof Button>,
    VariantProps<typeof buttonVariants> {
  isSubmitting?: boolean
  submittingLabel?: string
}

function SubmitButton({
  children,
  isSubmitting = false,
  submittingLabel = "Saving...",
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" loading={isSubmitting} {...props}>
      {isSubmitting ? submittingLabel : children}
    </Button>
  )
}

export { SubmitButton }
