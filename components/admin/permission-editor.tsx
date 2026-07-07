"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"

import { updatePermissionsAction } from "@/actions/admin-users"
import { RESOURCES, ACTIONS, type Permissions } from "@/types/permissions"
import { permissionTemplates } from "@/components/admin/permission-templates"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { FormError } from "@/components/forms/form-error"
import { SubmitButton } from "@/components/forms/submit-button"

interface PermissionEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  target: {
    userId: string
    name: string
    role: "admin" | "super_admin"
    isSuperAdmin: boolean
    permissions: Permissions
  }
  viewerIsSuperAdmin: boolean
  isSelf: boolean
  onSaved?: () => void
}

const resourceLabels: Record<string, string> = {
  dashboard: "Dashboard",
  projects: "Projects",
  services: "Services",
  testimonials: "Testimonials",
  homepage: "Homepage",
  pages: "Pages",
  blog: "Blog",
  media: "Media",
  messages: "Messages",
  inquiries: "Inquiries",
  seo: "SEO",
  settings: "Settings",
  featureFlags: "Feature Flags",
  users: "Users",
  auditLogs: "Audit Logs",
}

function PermissionEditor({
  open,
  onOpenChange,
  target,
  viewerIsSuperAdmin,
  isSelf,
  onSaved,
}: PermissionEditorProps) {
  const [formError, setFormError] = React.useState<string | null>(null)
  const readOnly = isSelf && !viewerIsSuperAdmin

  const form = useForm({
    defaultValues: {
      role: target.role,
      isSuperAdmin: target.isSuperAdmin,
      permissions: target.permissions,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)

      const response = await updatePermissionsAction({
        userId: target.userId,
        role: value.role,
        isSuperAdmin: value.isSuperAdmin,
        permissions: value.permissions,
      })

      if (!response.success) {
        setFormError(response.error.message)
        return
      }

      toast.success(`Permissions updated for ${target.name}`)
      onOpenChange(false)
      onSaved?.()
    },
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit permissions</SheetTitle>
          <SheetDescription>{target.name}</SheetDescription>
        </SheetHeader>

        <form
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          {readOnly && (
            <FormError message="You cannot modify your own permissions. Ask a Super Admin to make changes." />
          )}

          <form.Field name="role">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Role</label>
                <select
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm disabled:opacity-50"
                  value={field.state.value}
                  disabled={readOnly}
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
                    disabled={readOnly}
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
                {permissionTemplates.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {permissionTemplates.map((template) => (
                      <Button
                        key={template.label}
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={readOnly}
                        onClick={() => field.handleChange(template.permissions)}
                      >
                        {template.label}
                      </Button>
                    ))}
                  </div>
                )}

                <div className="overflow-hidden rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
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
                            <td className="px-3 py-2">{resourceLabels[resource] ?? resource}</td>
                            {ACTIONS.map((action) => (
                              <td key={action} className="px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  disabled={readOnly}
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

          <SheetFooter className="px-0">
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <SubmitButton type="submit" isSubmitting={isSubmitting} disabled={readOnly}>
                  Save changes
                </SubmitButton>
              )}
            </form.Subscribe>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export { PermissionEditor }
