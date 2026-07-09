"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { FormDialog } from "@/components/admin/form-dialog"
import { ServiceForm } from "@/components/admin/service-form"

function NewServiceButton() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>New Service</Button>
      <FormDialog open={open} onOpenChange={setOpen} title="New service">
        <ServiceForm
          onSuccess={() => {
            setOpen(false)
            router.refresh()
          }}
        />
      </FormDialog>
    </>
  )
}

export { NewServiceButton }
