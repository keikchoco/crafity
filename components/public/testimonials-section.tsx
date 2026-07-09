import Image from "next/image"
import { QuoteIcon } from "lucide-react"

import type { Testimonial } from "@/types/testimonial"
import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { SectionLabel } from "@/components/shared/section-label"
import { EmptyState } from "@/components/shared/empty-state"
import { StarRating } from "@/components/shared/star-rating"
import { FadeIn } from "@/components/motion/fade-in"
import { SlideUp } from "@/components/motion/slide-up"

interface TestimonialsSectionProps {
  testimonials: Pick<
    Testimonial,
    "_id" | "clientName" | "position" | "company" | "image" | "review" | "rating"
  >[]
  index?: string
}

function TestimonialsSection({ testimonials, index }: TestimonialsSectionProps) {
  return (
    <Section>
      <Container size="lg">
        <FadeIn>
          <Stack gap="sm" className="mb-10 max-w-xl">
            <SectionLabel index={index}>Testimonials</SectionLabel>
            <Typography variant="h2">What clients say</Typography>
          </Stack>
        </FadeIn>

        {testimonials.length === 0 ? (
          <EmptyState
            title="No testimonials yet"
            description="Client reviews will appear here once published."
          />
        ) : (
          <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
            {testimonials.map((testimonial, i) => (
              <SlideUp key={testimonial._id} delay={i * 0.08}>
                <div className="flex h-full flex-col gap-6 border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <QuoteIcon className="size-6 text-primary" />
                    <StarRating rating={testimonial.rating} />
                  </div>
                  <p className="text-lg leading-relaxed text-foreground">
                    {testimonial.review}
                  </p>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.clientName}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {testimonial.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.position}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </SlideUp>
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}

export { TestimonialsSection }
