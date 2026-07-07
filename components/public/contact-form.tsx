"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { CheckCircle2Icon } from "lucide-react"

import { submitContactAction } from "@/actions/contact"
import { contactSchema, type InferredContactInput } from "@/schemas/contact.schema"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/forms/form-field"
import { FormError } from "@/components/forms/form-error"
import { SubmitButton } from "@/components/forms/submit-button"

const emptyContact: InferredContactInput = {
  name: "",
  email: "",
  company: "",
  subject: "",
  message: "",
}

function ContactForm() {
  const [formError, setFormError] = React.useState<string | null>(null)
  const [submitted, setSubmitted] = React.useState(false)
  const [honeypot, setHoneypot] = React.useState("")

  const form = useForm({
    defaultValues: emptyContact,
    onSubmit: async ({ value, formApi }) => {
      setFormError(null)

      const response = await submitContactAction({ ...value, website: honeypot })

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
        <p className="font-heading text-lg font-medium text-foreground">Message sent</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thanks for reaching out — we&apos;ll get back to you within one business day.
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
          validators={{ onBlur: ({ value }) => contactSchema.shape.name.safeParse(value).error?.issues[0]?.message }}
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
          validators={{ onBlur: ({ value }) => contactSchema.shape.email.safeParse(value).error?.issues[0]?.message }}
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

      <form.Field
        name="subject"
        validators={{ onBlur: ({ value }) => contactSchema.shape.subject.safeParse(value).error?.issues[0]?.message }}
      >
        {(field) => (
          <FormField label="Subject" htmlFor="subject" required error={field.state.meta.errors[0]}>
            <Input
              id="subject"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field
        name="message"
        validators={{ onBlur: ({ value }) => contactSchema.shape.message.safeParse(value).error?.issues[0]?.message }}
      >
        {(field) => (
          <FormField label="Message" htmlFor="message" required error={field.state.meta.errors[0]}>
            <Textarea
              id="message"
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
            Send Message
          </SubmitButton>
        )}
      </form.Subscribe>
    </form>
  )
}

export { ContactForm }
