"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { FormDialog } from "@/components/admin/form-dialog"
import { ProjectForm } from "@/components/admin/project-form"

function NewProjectButton() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>New Project</Button>
      <FormDialog open={open} onOpenChange={setOpen} title="New project">
        <ProjectForm
          onSuccess={() => {
            setOpen(false)
            router.refresh()
          }}
        />
      </FormDialog>
    </>
  )
}

export { NewProjectButton }
