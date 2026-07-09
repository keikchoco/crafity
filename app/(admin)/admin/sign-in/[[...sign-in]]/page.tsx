'use client'
import { Backdrop } from "@/components/shared/backdrop"
import { ClerkFailed, ClerkLoading, SignIn } from "@clerk/nextjs"

export default function AdminSignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <Backdrop />
      <div className="relative z-10 w-full max-w-md">
        <ClerkLoading>
          <div className="rounded-2xl border border-border/60 bg-background/90 p-6 text-sm text-muted-foreground shadow-lg backdrop-blur">
            Loading sign-in...
          </div>
        </ClerkLoading>
        <ClerkFailed>
          <div className="rounded-2xl border border-border/60 bg-background/90 p-6 text-sm text-muted-foreground shadow-lg backdrop-blur">
            Sign-in failed to load. Check the Clerk publishable key, allowed origins, and the
            deployed environment variables.
          </div>
        </ClerkFailed>
        <SignIn routing="path" path="/admin/sign-in" />
      </div>
    </div>
  )
}
