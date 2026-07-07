import Link from "next/link"
import Image from "next/image"
import { ArrowUpRightIcon } from "lucide-react"

import type { Project } from "@/types/project"

interface ProjectCardProps {
  project: Pick<Project, "slug" | "title" | "shortDescription" | "coverImage" | "category" | "technologies">
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/portfolio/${project.slug}`} className="group block">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <ArrowUpRightIcon className="size-4" />
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {project.category}
        </span>
        <h3 className="font-heading text-lg font-medium text-foreground">{project.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{project.shortDescription}</p>
        {project.technologies.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

export { ProjectCard }
