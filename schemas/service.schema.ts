import { z } from "zod"

import { slugSchema } from "@/schemas/common.schema"

export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: slugSchema.optional(),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  features: z.array(z.string()).default([]),
  order: z.coerce.number().int().default(0),
})

export type InferredServiceInput = z.infer<typeof serviceSchema>
