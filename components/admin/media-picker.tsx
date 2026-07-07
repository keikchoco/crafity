"use client"

import * as React from "react"
import Image from "next/image"
import { toast } from "sonner"
import { UploadIcon, Loader2Icon } from "lucide-react"

import { listMediaAction, uploadMediaAction, type MediaListItem } from "@/actions/media"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/forms/form-field"
import { FormError } from "@/components/forms/form-error"
import { cn } from "@/lib/utils"

interface MediaPickerProps {
  value?: string
  onSelect: (url: string) => void
  triggerLabel?: string
}

function MediaPicker({ value, onSelect, triggerLabel = "Choose image" }: MediaPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<MediaListItem[] | null>(null)
  const loading = open && items === null
  const [uploading, setUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const [altText, setAltText] = React.useState("")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (!open || items !== null) return

    listMediaAction().then((response) => {
      if (response.success) {
        setItems(response.data.items)
      } else {
        toast.error(response.error.message)
        setItems([])
      }
    })
  }, [open, items])

  async function handleUpload(event: React.FormEvent) {
    event.preventDefault()
    setUploadError(null)

    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      setUploadError("Choose a file first")
      return
    }
    if (!altText) {
      setUploadError("Alt text is required")
      return
    }

    const formData = new FormData()
    formData.set("file", file)
    formData.set("altText", altText)

    setUploading(true)
    const response = await uploadMediaAction(formData)
    setUploading(false)

    if (!response.success) {
      setUploadError(response.error.message)
      return
    }

    toast.success("Image uploaded")
    onSelect(response.data.url)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="outline" />}>
        {value ? (
          <span className="flex items-center gap-2">
            <Image src={value} alt="" width={24} height={24} className="rounded object-cover" />
            Change image
          </span>
        ) : (
          triggerLabel
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select image</DialogTitle>
          <DialogDescription>Upload a new file or choose an existing one.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpload} className="flex flex-col gap-3 border-b border-border pb-4">
          <div className="flex gap-2">
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" />
          </div>
          <FormField label="Alt text" htmlFor="picker-alt-text" required>
            <Input
              id="picker-alt-text"
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="Describe the image"
            />
          </FormField>
          {uploadError && <FormError message={uploadError} />}
          <Button type="submit" loading={uploading} className="self-start">
            <UploadIcon />
            Upload
          </Button>
        </form>

        {loading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2Icon className="animate-spin" />
          </div>
        ) : (items ?? []).length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No uploads yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {(items ?? []).map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn(
                  "relative aspect-square overflow-hidden rounded-md ring-2 ring-transparent transition hover:ring-primary",
                  value === item.url && "ring-primary",
                )}
                onClick={() => {
                  onSelect(item.url)
                  setOpen(false)
                }}
              >
                <Image src={item.url} alt={item.altText} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { MediaPicker }
