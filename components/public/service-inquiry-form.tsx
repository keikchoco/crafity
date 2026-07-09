"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { CheckCircle2Icon } from "lucide-react"

import { submitServiceInquiryAction } from "@/actions/service-inquiry"
import { serviceInquirySchema, type InferredServiceInquiryInput } from "@/schemas/service-inquiry.schema"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { FormField } from "@/components/forms/form-field"
import { FormError } from "@/components/forms/form-error"
import { SubmitButton } from "@/components/forms/submit-button"

const emptyInquiry: InferredServiceInquiryInput = {
  name: "",
  email: "",
  company: "",
  service: "",
  budget: "",
  timeline: "",
  description: "",
}

interface ServiceInquiryFormProps {
  availableServices: string[]
}

function ServiceInquiryForm({ availableServices }: ServiceInquiryFormProps) {
  const [formError, setFormError] = React.useState<string | null>(null)
  const [submitted, setSubmitted] = React.useState(false)
  const [honeypot, setHoneypot] = React.useState("")

  const form = useForm({
    defaultValues: emptyInquiry,
    onSubmit: async ({ value, formApi }) => {
      setFormError(null)

      const response = await submitServiceInquiryAction({ ...value, website: honeypot })

      if (!response.success) {
        setFormError(response.error.message)
        return
      }

      setSubmitted(true)
      formApi.reset()
    },
  })

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-6 py-16 text-center">
        <CheckCircle2Icon className="size-8 text-primary" />
        <p className="font-heading text-lg font-medium text-foreground">Inquiry received</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thanks for the details — we&apos;ll review your project and get back to you within one
          business day.
        </p>
      </div>
    )
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field
          name="name"
          validators={{ onBlur: ({ value }) => serviceInquirySchema.shape.name.safeParse(value).error?.issues[0]?.message }}
        >
          {(field) => (
            <FormField label="Name" htmlFor="name" required error={field.state.meta.errors[0]}>
              <Input
                id="name"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{ onBlur: ({ value }) => serviceInquirySchema.shape.email.safeParse(value).error?.issues[0]?.message }}
        >
          {(field) => (
            <FormField label="Email" htmlFor="email" required error={field.state.meta.errors[0]}>
              <Input
                id="email"
                type="email"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
            </FormField>
          )}
        </form.Field>
      </div>

      <form.Field name="company">
        {(field) => (
          <FormField label="Company" htmlFor="company" description="Optional">
            <Input
              id="company"
              value={field.state.value ?? ""}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </FormField>
        )}
      </form.Field>

      {availableServices.length > 0 && (
        <form.Field
          name="service"
          validators={{ onBlur: ({ value }) => serviceInquirySchema.shape.service.safeParse(value).error?.issues[0]?.message }}
        >
          {(field) => (
            <FormField label="Service needed" htmlFor="service" required error={field.state.meta.errors[0]}>
              <Select
                value={field.state.value || null}
                onValueChange={(value) => field.handleChange(value ?? "")}
              >
                <SelectTrigger id="service" onBlur={field.handleBlur} className="w-full">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {availableServices.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}
        </form.Field>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field
          name="budget"
          validators={{ onBlur: ({ value }) => serviceInquirySchema.shape.budget.safeParse(value).error?.issues[0]?.message }}
        >
          {(field) => (
            <FormField label="Budget" htmlFor="budget" required error={field.state.meta.errors[0]}>
              <Input
                id="budget"
                placeholder="e.g. ₱10k-₱25k"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field
          name="timeline"
          validators={{ onBlur: ({ value }) => serviceInquirySchema.shape.timeline.safeParse(value).error?.issues[0]?.message }}
        >
          {(field) => (
            <FormField label="Timeline" htmlFor="timeline" required error={field.state.meta.errors[0]}>
              <Input
                id="timeline"
                placeholder="e.g. 2-3 months"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
            </FormField>
          )}
        </form.Field>
      </div>

      <form.Field
        name="description"
        validators={{ onBlur: ({ value }) => serviceInquirySchema.shape.description.safeParse(value).error?.issues[0]?.message }}
      >
        {(field) => (
          <FormField
            label="Project Description"
            htmlFor="description"
            required
            error={field.state.meta.errors[0]}
          >
            <Textarea
              id="description"
              rows={6}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>

      {formError && <FormError message={formError} />}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <SubmitButton
            isSubmitting={isSubmitting}
            submittingLabel="Sending..."
            size="lg"
            className="self-start"
          >
            Submit Inquiry
          </SubmitButton>
        )}
      </form.Subscribe>
    </form>
  )
}

export { ServiceInquiryForm }
