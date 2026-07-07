import type { Service } from "@/types/service"
import { EmptyState } from "@/components/shared/empty-state"
import { SlideUp } from "@/components/motion/slide-up"
import { DynamicIcon } from "@/components/public/dynamic-icon"

interface ServicesGridProps {
  services: Pick<Service, "_id" | "title" | "description" | "icon" | "features">[]
}

function ServicesGrid({ services }: ServicesGridProps) {
  if (services.length === 0) {
    return (
      <EmptyState
        title="Services coming soon"
        description="Our service offerings will be published here shortly."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <SlideUp key={service._id} delay={index * 0.06}>
          <div className="flex h-full flex-col gap-4 border-t border-border pt-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <DynamicIcon name={service.icon} className="size-5 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-medium text-foreground">{service.title}</h3>
            <p className="text-sm text-muted-foreground">{service.description}</p>
            {service.features.length > 0 && (
              <ul className="mt-auto flex flex-col gap-1.5 pt-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SlideUp>
      ))}
    </div>
  )
}

export { ServicesGrid }
