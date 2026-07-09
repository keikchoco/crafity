"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { FormDialog } from "@/components/admin/form-dialog"
import { BlogPostForm } from "@/components/admin/blog-post-form"

function NewBlogPostButton() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>New Post</Button>
      <FormDialog open={open} onOpenChange={setOpen} title="New post" className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <BlogPostForm
          onSuccess={() => {
            setOpen(false)
            router.refresh()
          }}
        />
      </FormDialog>
    </>
  )
}

export { NewBlogPostButton }
