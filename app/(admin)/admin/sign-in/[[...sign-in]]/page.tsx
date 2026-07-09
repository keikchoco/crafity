'use client'
import { Backdrop } from "@/components/shared/backdrop"
import { SignIn } from "@clerk/nextjs"

export default function AdminSignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <Backdrop />
      <div className="relative z-10">
        <SignIn routing="path" path="/admin/sign-in" />
      </div>
    </div>
  )
}
