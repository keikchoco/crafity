import { z } from "zod"

import { ACTIONS, RESOURCES } from "@/types/permissions"
import { emailSchema } from "@/schemas/common.schema"

export const permissionsSchema = z
  .object(
    Object.fromEntries(
      RESOURCES.map((resource) => [
        resource,
        z
          .object(Object.fromEntries(ACTIONS.map((action) => [action, z.boolean()])))
          .partial()
          .optional(),
      ]),
    ),
  )
  .partial()

export const inviteAdminSchema = z.object({
  email: emailSchema,
  role: z.enum(["admin", "super_admin"]),
  isSuperAdmin: z.boolean(),
  permissions: permissionsSchema,
})

export const updatePermissionsSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["admin", "super_admin"]),
  isSuperAdmin: z.boolean(),
  permissions: permissionsSchema,
})

export type InviteAdminInput = z.infer<typeof inviteAdminSchema>
export type UpdatePermissionsInput = z.infer<typeof updatePermissionsSchema>
