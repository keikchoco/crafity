import Image from "next/image"

import { cn } from "@/lib/utils"

interface TestimonialAvatarProps {
  image?: string
  name: string
  size: number
  className?: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : ""
  return (first + last).toUpperCase()
}

function TestimonialAvatar({ image, name, size, className }: TestimonialAvatarProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-muted",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {image ? (
        <Image src={image} alt={name} fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <div
          className="flex size-full items-center justify-center bg-primary/10 font-medium text-primary"
          style={{ fontSize: size * 0.36 }}
          aria-hidden="true"
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  )
}

export { TestimonialAvatar }
