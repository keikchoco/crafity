import { Skeleton } from "@/components/ui/skeleton"

export default function AdminMediaLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-24 w-full" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="aspect-square" />
        ))}
      </div>
    </div>
  )
}
