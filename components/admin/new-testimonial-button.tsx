"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { FormDialog } from "@/components/admin/form-dialog"
import { TestimonialForm } from "@/components/admin/testimonial-form"

interface NewTestimonialButtonProps {
  projectOptions: { id: string; title: string }[]
}

function NewTestimonialButton({ projectOptions }: NewTestimonialButtonProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>New Testimonial</Button>
      <FormDialog open={open} onOpenChange={setOpen} title="New testimonial">
        <TestimonialForm
          projectOptions={projectOptions}
          onSuccess={() => {
            setOpen(false)
            router.refresh()
          }}
        />
      </FormDialog>
    </>
  )
}

export { NewTestimonialButton }
