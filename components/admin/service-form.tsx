"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"

import { createServiceAction, updateServiceAction } from "@/actions/services"
import type { InferredServiceInput } from "@/schemas/service.schema"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/forms/form-field"
import { FormError } from "@/components/forms/form-error"
import { SubmitButton } from "@/components/forms/submit-button"

const emptyService: InferredServiceInput = {
  title: "",
  slug: "",
  description: "",
  icon: "",
  features: [],
  order: 0,
}

interface ServiceFormProps {
  serviceId?: string
  defaultValues?: InferredServiceInput
}

function ServiceForm({ serviceId, defaultValues }: ServiceFormProps) {
  const [formError, setFormError] = React.useState<string | null>(null)
  const [featuresText, setFeaturesText] = React.useState(
    (defaultValues?.features ?? []).join(", "),
  )

  const form = useForm({
    defaultValues: defaultValues ?? emptyService,
    onSubmit: async ({ value }) => {
      setFormError(null)

      const payload = {
        ...value,
        features: featuresText
          .split(",")
          .map((feature) => feature.trim())
          .filter(Boolean),
      }

      const response = serviceId
        ? await updateServiceAction(serviceId, payload)
        : await createServiceAction(payload)

      if (!response.success) {
        setFormError(response.error.message)
        return
      }

      toast.success(serviceId ? "Service updated" : "Service created")
      window.location.href = "/admin/services"
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

      <form.Field name="icon">
        {(field) => (
          <FormField
            label="Icon"
            htmlFor="icon"
            required
            description="A lucide-react icon name, e.g. Rocket"
          >
            <Input
              id="icon"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </FormField>
        )}
      </form.Field>

      <FormField label="Features" htmlFor="features" description="Comma-separated">
        <Input
          id="features"
          value={featuresText}
          onChange={(event) => setFeaturesText(event.target.value)}
        />
      </FormField>

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

      {formError && <FormError message={formError} />}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <SubmitButton type="submit" isSubmitting={isSubmitting} className="self-start">
            {serviceId ? "Save changes" : "Create service"}
          </SubmitButton>
        )}
      </form.Subscribe>
    </form>
  )
}

export { ServiceForm }
