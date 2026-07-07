"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"

import { inviteAdminAction } from "@/actions/admin-users"
import { RESOURCES, ACTIONS, type Permissions } from "@/types/permissions"
import { permissionTemplates } from "@/components/admin/permission-templates"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/forms/form-field"
import { FormError } from "@/components/forms/form-error"
import { SubmitButton } from "@/components/forms/submit-button"

interface InviteAdminDialogProps {
  viewerIsSuperAdmin: boolean
  onInvited?: () => void
}

const emptyPermissions: Permissions = {}

function InviteAdminDialog({ viewerIsSuperAdmin, onInvited }: InviteAdminDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: "",
      role: "admin" as "admin" | "super_admin",
      isSuperAdmin: false,
      permissions: emptyPermissions,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)

      const response = await inviteAdminAction(value)

      if (!response.success) {
        setFormError(response.error.message)
        return
      }

      toast.success(`Invitation sent to ${value.email}`)
      form.reset()
      setOpen(false)
      onInvited?.()
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Invite Administrator</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite administrator</DialogTitle>
          <DialogDescription>
            Sends a Clerk invitation email. The invited user gets CMS access as soon as they accept.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.Field name="email">
            {(field) => (
              <FormField label="Email" htmlFor="invite-email" required>
                <Input
                  id="invite-email"
                  type="email"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="admin@example.com"
                />
              </FormField>
            )}
          </form.Field>

          <form.Field name="role">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Role</label>
                <select
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(event.target.value as "admin" | "super_admin")
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            )}
          </form.Field>

          {viewerIsSuperAdmin && (
            <form.Field name="isSuperAdmin">
              {(field) => (
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={field.state.value}
                    onChange={(event) => field.handleChange(event.target.checked)}
                  />
                  Super Admin (bypasses all permission checks)
                </label>
              )}
            </form.Field>
          )}

          <form.Field name="permissions">
            {(field) => (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {permissionTemplates.map((template) => (
                    <Button
                      key={template.label}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.handleChange(template.permissions)}
                    >
                      {template.label}
                    </Button>
                  ))}
                </div>

                <div className="max-h-64 overflow-y-auto rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Module</th>
                        {ACTIONS.map((action) => (
                          <th key={action} className="px-3 py-2 text-center font-medium capitalize">
                            {action}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {RESOURCES.filter((resource) => resource !== "users" || viewerIsSuperAdmin).map(
                        (resource) => (
                          <tr key={resource} className="border-t border-border">
                            <td className="px-3 py-2">{resource}</td>
                            {ACTIONS.map((action) => (
                              <td key={action} className="px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={field.state.value[resource]?.[action] === true}
                                  onChange={(event) =>
                                    field.handleChange({
                                      ...field.state.value,
                                      [resource]: {
                                        ...field.state.value[resource],
                                        [action]: event.target.checked,
                                      },
                                    })
                                  }
                                />
                              </td>
                            ))}
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </form.Field>

          {formError && <FormError message={formError} />}

          <DialogFooter>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <SubmitButton type="submit" isSubmitting={isSubmitting}>
                  Send invitation
                </SubmitButton>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { InviteAdminDialog }
