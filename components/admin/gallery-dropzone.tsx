"use client"

import * as React from "react"
import { toast } from "sonner"
import { UploadIcon, Loader2Icon } from "lucide-react"

import { uploadMediaAction } from "@/actions/media"
import { cn } from "@/lib/utils"

interface GalleryDropzoneProps {
  onUpload: (results: { url: string; alt: string }[]) => void
  getAltText: (index: number) => string
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]

function GalleryDropzone({ onUpload, getAltText }: GalleryDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  async function uploadFiles(files: File[]) {
    const imageFiles = files.filter((file) => ALLOWED_TYPES.includes(file.type))
    if (imageFiles.length === 0) {
      toast.error("Choose image files (JPEG, PNG, WebP, or SVG)")
      return
    }

    setIsUploading(true)
    const results: { url: string; alt: string }[] = []

    for (const [index, file] of imageFiles.entries()) {
      const alt = getAltText(index)
      const formData = new FormData()
      formData.set("file", file)
      formData.set("altText", alt)

      const response = await uploadMediaAction(formData)
      if (!response.success) {
        toast.error(`${file.name}: ${response.error.message}`)
        continue
      }
      results.push({ url: response.data.url, alt })
    }

    setIsUploading(false)

    if (results.length > 0) {
      onUpload(results)
      toast.success(`${results.length} image${results.length > 1 ? "s" : ""} uploaded`)
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    const files = Array.from(event.dataTransfer.files ?? [])
    if (files.length > 0) uploadFiles(files)
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    if (files.length > 0) uploadFiles(files)
    event.target.value = ""
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !isUploading && fileInputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-input px-4 py-6 text-center transition-colors",
        isDragging ? "border-primary bg-primary/5" : "hover:border-foreground/40",
        isUploading && "pointer-events-none opacity-60",
      )}
    >
      {isUploading ? (
        <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
      ) : (
        <UploadIcon className="size-5 text-muted-foreground" />
      )}
      <p className="text-sm text-foreground">
        {isUploading ? "Uploading..." : "Drag and drop images, or click to browse"}
      </p>
      <p className="text-xs text-muted-foreground">You can select multiple files at once</p>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

export { GalleryDropzone }
