'use client'
import { Backdrop } from "@/components/shared/backdrop"
import { SignIn } from "@clerk/nextjs"

export default function AdminSignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Backdrop />
      <SignIn />
    </div>
  )
}
