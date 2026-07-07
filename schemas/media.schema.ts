import { z } from "zod"

export const mediaMetadataSchema = z.object({
  altText: z.string().min(1, "Alt text is required for accessibility").max(300),
  caption: z.string().max(500).optional(),
})

export type InferredMediaMetadataInput = z.infer<typeof mediaMetadataSchema>
