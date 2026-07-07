import type { Permissions } from "@/types/permissions"

export interface PermissionTemplate {
  label: string
  description: string
  permissions: Permissions
}

export const permissionTemplates: PermissionTemplate[] = [
  {
    label: "Content Manager",
    description: "Projects, services, testimonials, and media — view and edit.",
    permissions: {
      projects: { view: true, edit: true },
      services: { view: true, edit: true },
      testimonials: { view: true, edit: true },
      media: { view: true, edit: true },
    },
  },
  {
    label: "Editor",
    description: "Read access to projects, services, and testimonials; full blog access.",
    permissions: {
      projects: { view: true },
      services: { view: true },
      testimonials: { view: true },
      blog: { view: true, edit: true },
    },
  },
  {
    label: "Administrator",
    description: "Most CMS modules enabled, excluding user management and settings.",
    permissions: {
      dashboard: { view: true },
      projects: { view: true, edit: true },
      services: { view: true, edit: true },
      testimonials: { view: true, edit: true },
      homepage: { view: true, edit: true },
      pages: { view: true, edit: true },
      blog: { view: true, edit: true },
      media: { view: true, edit: true },
      messages: { view: true, edit: true },
      inquiries: { view: true, edit: true },
      seo: { view: true, edit: true },
    },
  },
]
