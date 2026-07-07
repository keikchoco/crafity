"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { UploadIcon, TrashIcon } from "lucide-react"

import { uploadMediaAction, deleteMediaAction, type MediaListItem } from "@/actions/media"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/forms/form-field"
import { FormError } from "@/components/forms/form-error"
import { EmptyState } from "@/components/shared/empty-state"

interface MediaLibraryGridProps {
  items: MediaListItem[]
}

function MediaLibraryGrid({ items }: MediaLibraryGridProps) {
  const router = useRouter()
  const [uploading, setUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const [altText, setAltText] = React.useState("")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

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
    setAltText("")
    if (fileInputRef.current) fileInputRef.current.value = ""
    router.refresh()
  }

  async function handleDelete(item: MediaListItem) {
    if (!window.confirm(`Delete "${item.filename}"? This cannot be undone.`)) return

    const response = await deleteMediaAction(item.id)

    if (!response.success) {
      toast.error(response.error.message)
      return
    }

    toast.success("Image deleted")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleUpload} className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-end">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          className="text-sm"
        />
        <FormField label="Alt text" htmlFor="library-alt-text" required className="flex-1">
          <Input
            id="library-alt-text"
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            placeholder="Describe the image"
          />
        </FormField>
        <Button type="submit" loading={uploading}>
          <UploadIcon />
          Upload
        </Button>
      </form>
      {uploadError && <FormError message={uploadError} />}

      {items.length === 0 ? (
        <EmptyState
          title="No media yet"
          description="Upload your first image to start building the media library."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {items.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-md border border-border">
              <Image src={item.url} alt={item.altText} fill className="object-cover" />
              <button
                type="button"
                onClick={() => handleDelete(item)}
                className="absolute top-1 right-1 rounded-md bg-background/80 p-1.5 opacity-0 transition group-hover:opacity-100"
                aria-label={`Delete ${item.filename}`}
              >
                <TrashIcon className="size-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { MediaLibraryGrid }
