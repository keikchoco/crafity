import type { Lifecycle } from "./lifecycle"

export interface GalleryImage {
  url: string
  alt: string
  caption?: string
}

export interface SeoFields {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  canonicalUrl?: string
}

export interface Project extends Lifecycle {
  _id: string
  title: string
  slug: string
  shortDescription: string
  description: string
  coverImage: string
  gallery: GalleryImage[]
  category: string
  technologies: string[]
  client: string
  timeline: string
  role: string
  websiteLink: string
  problem: string
  research: string
  solution: string
  designProcess: string
  developmentProcess: string
  results: string
  featured: boolean
  seo: SeoFields
}
