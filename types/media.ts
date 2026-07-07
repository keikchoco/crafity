export type MediaType = "image/jpeg" | "image/png" | "image/webp" | "image/svg+xml"

export interface MediaDimensions {
  width: number
  height: number
}

export interface Media {
  _id: string
  filename: string
  url: string
  type: MediaType
  size: number
  dimensions: MediaDimensions | null
  altText: string
  caption?: string
  uploadedBy: string
  createdAt: Date
}
