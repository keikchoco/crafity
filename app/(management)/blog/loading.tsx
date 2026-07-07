import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function BlogLoading() {
  return (
    <Section>
      <Container size="lg">
        <Skeleton className="mb-4 h-10 w-64" />
        <Skeleton className="mb-10 h-6 w-96 max-w-full" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="aspect-4/3 w-full" />
          ))}
        </div>
      </Container>
    </Section>
  )
}
