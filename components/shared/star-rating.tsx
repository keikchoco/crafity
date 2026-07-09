import { StarIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  max?: number
  className?: string
  starClassName?: string
}

function StarRating({ rating, max = 5, className, starClassName }: StarRatingProps) {
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Rated ${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, index) => (
        <StarIcon
          key={index}
          className={cn(
            "size-4",
            index < rating ? "fill-primary text-primary" : "fill-none text-muted-foreground/30",
            starClassName,
          )}
        />
      ))}
    </div>
  )
}

export { StarRating }
