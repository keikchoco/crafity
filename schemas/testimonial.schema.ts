import { z } from "zod"

import { objectIdSchema } from "@/schemas/common.schema"

export const testimonialSchema = z.object({
  clientName: z.string().min(1, "Client name is required").max(200),
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  image: z.string().min(1, "Image is required"),
  review: z.string().min(1, "Review is required"),
  rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5").default(5),
  projectId: objectIdSchema.nullable().optional(),
  order: z.coerce.number().int().default(0),
})

export type InferredTestimonialInput = z.infer<typeof testimonialSchema>
