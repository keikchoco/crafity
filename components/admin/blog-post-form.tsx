"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"

import { createBlogPostAction, updateBlogPostAction } from "@/actions/blog-posts"
import type { InferredBlogPostInput } from "@/schemas/blog-post.schema"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/forms/form-field"
import { FormError } from "@/components/forms/form-error"
import { SubmitButton } from "@/components/forms/submit-button"
import { MediaPicker } from "@/components/admin/media-picker"

const emptyPost: InferredBlogPostInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "",
  category: "",
  tags: [],
  seo: {},
}

interface BlogPostFormProps {
  postId?: string
  defaultValues?: InferredBlogPostInput
}

function BlogPostForm({ postId, defaultValues }: BlogPostFormProps) {
  const [formError, setFormError] = React.useState<string | null>(null)
  const [tagsText, setTagsText] = React.useState((defaultValues?.tags ?? []).join(", "))

  const form = useForm({
    defaultValues: defaultValues ?? emptyPost,
    onSubmit: async ({ value }) => {
      setFormError(null)

      const payload = {
        ...value,
        tags: tagsText
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }

      const response = postId
        ? await updateBlogPostAction(postId, payload)
        : await createBlogPostAction(payload)

      if (!response.success) {
        setFormError(response.error.message)
        return
      }

      toast.success(postId ? "Post updated" : "Post created")
      window.location.href = "/admin/blog"
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

      <form.Field name="excerpt">
        {(field) => (
          <FormField label="Excerpt" htmlFor="excerpt" required>
            <Textarea
              id="excerpt"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              rows={2}
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

      <div className="grid gap-4 sm:grid-cols-3">
        <form.Field name="author">
          {(field) => (
            <FormField label="Author" htmlFor="author" required>
              <Input
                id="author"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>

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

        <FormField label="Tags" htmlFor="tags" description="Comma-separated">
          <Input
            id="tags"
            value={tagsText}
            onChange={(event) => setTagsText(event.target.value)}
          />
        </FormField>
      </div>

      <form.Field name="content">
        {(field) => (
          <FormField label="Content" htmlFor="content" required>
            <Textarea
              id="content"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              rows={14}
            />
          </FormField>
        )}
      </form.Field>

      {formError && <FormError message={formError} />}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <SubmitButton type="submit" isSubmitting={isSubmitting} className="self-start">
            {postId ? "Save changes" : "Create post"}
          </SubmitButton>
        )}
      </form.Subscribe>
    </form>
  )
}

export { BlogPostForm }
