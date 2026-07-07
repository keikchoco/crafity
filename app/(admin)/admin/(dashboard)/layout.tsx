import { redirect } from "next/navigation"

import { getCurrentAdmin } from "@/lib/permissions"
import { AdminProvider } from "@/components/admin/admin-provider"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect("/admin/sign-in")
  }

  if (!admin.isSuperAdmin && !admin.role) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 p-8 text-center">
        <h1 className="font-heading text-xl font-semibold">No CMS access</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Your account is signed in but hasn&apos;t been granted CMS access yet. Contact a super
          admin to request access.
        </p>
      </div>
    )
  }

  return (
    <AdminProvider admin={admin}>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                />
                <span className="text-sm font-medium text-foreground">Crafity CMS</span>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AdminProvider>
  )
}
