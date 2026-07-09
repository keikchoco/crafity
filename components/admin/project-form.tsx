"use client"

import * as React from "react"
import Image from "next/image"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { TrashIcon } from "lucide-react"

import { createProjectAction, updateProjectAction } from "@/actions/projects"
import type { InferredProjectInput } from "@/schemas/project.schema"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/forms/form-field"
import { FormError } from "@/components/forms/form-error"
import { SubmitButton } from "@/components/forms/submit-button"
import { TagInput } from "@/components/forms/tag-input"
import { MediaPicker } from "@/components/admin/media-picker"
import { GalleryDropzone } from "@/components/admin/gallery-dropzone"

const emptyProject: InferredProjectInput = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  coverImage: "",
  gallery: [],
  category: "",
  technologies: [],
  client: "",
  timeline: "",
  role: "",
  websiteLink: "",
  budget: "",
  budgetVisible: false,
  problem: "",
  research: "",
  solution: "",
  designProcess: "",
  developmentProcess: "",
  results: "",
  featured: false,
  seo: {},
}

interface ProjectFormProps {
  projectId?: string
  defaultValues?: InferredProjectInput
  onSuccess?: () => void
}

function ProjectForm({ projectId, defaultValues, onSuccess }: ProjectFormProps) {
  const [formError, setFormError] = React.useState<string | null>(null)

  const form = useForm({
    defaultValues: defaultValues ?? emptyProject,
    onSubmit: async ({ value }) => {
      setFormError(null)

      const response = projectId
        ? await updateProjectAction(projectId, value)
        : await createProjectAction(value)

      if (!response.success) {
        setFormError(response.error.message)
        return
      }

      toast.success(projectId ? "Project updated" : "Project created")
      onSuccess?.()
    },
  })

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field name="title">
        {(field) => (
          <FormField label="Title" htmlFor="title" required>
            <Input
              id="title"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name="slug">
        {(field) => (
          <FormField label="Slug" htmlFor="slug" description="Leave blank to auto-generate from title">
            <Input
              id="slug"
              value={field.state.value ?? ""}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name="shortDescription">
        {(field) => (
          <FormField label="Short description" htmlFor="shortDescription" required>
            <Textarea
              id="shortDescription"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              rows={2}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <FormField label="Description" htmlFor="description" required>
            <Textarea
              id="description"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              rows={4}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name="coverImage">
        {(field) => (
          <FormField label="Cover image" htmlFor="coverImage" required>
            <MediaPicker value={field.state.value} onSelect={field.handleChange} />
          </FormField>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.values.title}>
        {(title) => (
          <form.Field name="gallery" mode="array">
            {(field) => (
              <FormField label="Gallery" htmlFor="gallery">
                <div className="flex flex-col gap-3">
                  {field.state.value.length > 0 && (
                    <div className="columns-2 gap-2 sm:columns-3">
                      {field.state.value.map((image, index) => (
                        <div
                          key={image.url + index}
                          className="group relative mb-2 break-inside-avoid overflow-hidden rounded-md bg-muted"
                        >
                          <Image
                            src={image.url}
                            alt={image.alt || title || "Gallery image"}
                            width={400}
                            height={400}
                            className="h-auto w-full object-contain"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="absolute top-1 right-1 bg-background/90 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                            onClick={() => field.removeValue(index)}
                          >
                            <TrashIcon className="text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <GalleryDropzone
                    getAltText={(index) =>
                      title
                        ? `${title} — gallery image ${field.state.value.length + index + 1}`
                        : `Gallery image ${field.state.value.length + index + 1}`
                    }
                    onUpload={(results) => {
                      for (const result of results) {
                        field.pushValue({ url: result.url, alt: result.alt })
                      }
                    }}
                  />
                  <MediaPicker
                    triggerLabel="Choose from library"
                    onSelect={(url) =>
                      field.pushValue({
                        url,
                        alt: title ? `${title} — gallery image ${field.state.value.length + 1}` : "Gallery image",
                      })
                    }
                  />
                </div>
              </FormField>
            )}
          </form.Field>
        )}
      </form.Subscribe>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="category">
          {(field) => (
            <FormField label="Category" htmlFor="category" required>
              <Input
                id="category"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="technologies">
          {(field) => (
            <FormField
              label="Technologies"
              htmlFor="technologies"
              description="Press comma or enter to add"
            >
              <TagInput id="technologies" value={field.state.value} onChange={field.handleChange} />
            </FormField>
          )}
        </form.Field>

        <form.Field name="client">
          {(field) => (
            <FormField label="Client" htmlFor="client" required>
              <Input
                id="client"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="timeline">
          {(field) => (
            <FormField label="Timeline" htmlFor="timeline" required>
              <Input
                id="timeline"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="role">
          {(field) => (
            <FormField label="Role" htmlFor="role" required>
              <Input
                id="role"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="websiteLink">
          {(field) => (
            <FormField
              label="Website link"
              htmlFor="websiteLink"
              description="Live project URL, optional"
            >
              <Input
                id="websiteLink"
                type="url"
                placeholder="https://example.com"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="budget">
          {(field) => (
            <FormField
              label="Budget"
              htmlFor="budget"
              description="e.g. ₱50k-₱100k"
            >
              <Input
                id="budget"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="budgetVisible">
          {(field) => (
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(event) => field.handleChange(event.target.checked)}
                />
                Show budget on case study page
              </label>
            </div>
          )}
        </form.Field>
      </div>

      {(["problem", "research", "solution", "designProcess", "developmentProcess", "results"] as const).map(
        (key) => (
          <form.Field key={key} name={key}>
            {(field) => (
              <FormField label={fieldLabel(key)} htmlFor={key}>
                <Textarea
                  id={key}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  rows={3}
                />
              </FormField>
            )}
          </form.Field>
        ),
      )}

      <form.Field name="featured">
        {(field) => (
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={(event) => field.handleChange(event.target.checked)}
            />
            Featured on homepage
          </label>
        )}
      </form.Field>

      {formError && <FormError message={formError} />}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <SubmitButton type="submit" isSubmitting={isSubmitting} className="self-start">
            {projectId ? "Save changes" : "Create project"}
          </SubmitButton>
        )}
      </form.Subscribe>
    </form>
  )
}

function fieldLabel(key: string): string {
  const labels: Record<string, string> = {
    problem: "Problem",
    research: "Research",
    solution: "Solution",
    designProcess: "Design process",
    developmentProcess: "Development process",
    results: "Results",
  }
  return labels[key] ?? key
}

export { ProjectForm }
