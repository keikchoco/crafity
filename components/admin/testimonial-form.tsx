"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { StarIcon } from "lucide-react"

import { createTestimonialAction, updateTestimonialAction } from "@/actions/testimonials"
import type { InferredTestimonialInput } from "@/schemas/testimonial.schema"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/forms/form-field"
import { FormError } from "@/components/forms/form-error"
import { SubmitButton } from "@/components/forms/submit-button"
import { MediaPicker } from "@/components/admin/media-picker"
import { cn } from "@/lib/utils"

const emptyTestimonial: InferredTestimonialInput = {
  clientName: "",
  position: "",
  company: "",
  image: "",
  review: "",
  rating: 5,
  projectId: null,
  order: 0,
}

interface TestimonialFormProps {
  testimonialId?: string
  defaultValues?: InferredTestimonialInput
  projectOptions: { id: string; title: string }[]
  onSuccess?: () => void
}

function TestimonialForm({
  testimonialId,
  defaultValues,
  projectOptions,
  onSuccess,
}: TestimonialFormProps) {
  const [formError, setFormError] = React.useState<string | null>(null)

  const form = useForm({
    defaultValues: defaultValues ?? emptyTestimonial,
    onSubmit: async ({ value }) => {
      setFormError(null)

      const response = testimonialId
        ? await updateTestimonialAction(testimonialId, value)
        : await createTestimonialAction(value)

      if (!response.success) {
        setFormError(response.error.message)
        return
      }

      toast.success(testimonialId ? "Testimonial updated" : "Testimonial created")
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
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="clientName">
          {(field) => (
            <FormField label="Client name" htmlFor="clientName" required>
              <Input
                id="clientName"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="position">
          {(field) => (
            <FormField label="Position" htmlFor="position" required>
              <Input
                id="position"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="company">
          {(field) => (
            <FormField label="Company" htmlFor="company" required>
              <Input
                id="company"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="order">
          {(field) => (
            <FormField label="Order" htmlFor="order">
              <Input
                id="order"
                type="number"
                value={field.state.value}
                onChange={(event) => field.handleChange(Number(event.target.value))}
              />
            </FormField>
          )}
        </form.Field>
      </div>

      <form.Field name="image">
        {(field) => (
          <FormField label="Profile image" htmlFor="image" required>
            <MediaPicker value={field.state.value} onSelect={field.handleChange} />
          </FormField>
        )}
      </form.Field>

      <form.Field name="review">
        {(field) => (
          <FormField label="Review" htmlFor="review" required>
            <Textarea
              id="review"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              rows={4}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name="rating">
        {(field) => (
          <FormField label="Rating" htmlFor="rating" required>
            <div className="flex items-center gap-1" id="rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={`Rate ${value} out of 5 stars`}
                  aria-pressed={field.state.value >= value}
                  onClick={() => field.handleChange(value)}
                  className="p-0.5"
                >
                  <StarIcon
                    className={cn(
                      "size-5 transition-colors",
                      field.state.value >= value
                        ? "fill-primary text-primary"
                        : "fill-none text-muted-foreground/40",
                    )}
                  />
                </button>
              ))}
            </div>
          </FormField>
        )}
      </form.Field>

      <form.Field name="projectId">
        {(field) => (
          <FormField label="Related project" htmlFor="projectId" description="Optional">
            <select
              id="projectId"
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              value={field.state.value ?? ""}
              onChange={(event) => field.handleChange(event.target.value || null)}
            >
              <option value="">None</option>
              {projectOptions.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </FormField>
        )}
      </form.Field>

      {formError && <FormError message={formError} />}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <SubmitButton type="submit" isSubmitting={isSubmitting} className="self-start">
            {testimonialId ? "Save changes" : "Create testimonial"}
          </SubmitButton>
        )}
      </form.Subscribe>
    </form>
  )
}

export { TestimonialForm }
