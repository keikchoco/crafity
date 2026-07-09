"use client"

import * as React from "react"
import Image from "next/image"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon, ExpandIcon } from "lucide-react"

import type { GalleryImage } from "@/types/project"
import { SlideUp } from "@/components/motion/slide-up"
import { Dialog, DialogPortal, DialogOverlay, DialogClose } from "@/components/ui/dialog"

interface ProjectGalleryProps {
  images: GalleryImage[]
}

function ProjectGallery({ images }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const activeImage = activeIndex !== null ? images[activeIndex] : null

  function closeIfBackground(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      setActiveIndex(null)
    }
  }

  return (
    <>
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {images.map((image, index) => (
          <SlideUp
            key={image.url}
            delay={(index % 6) * 0.06}
            className="mb-6 break-inside-avoid"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative block w-full overflow-hidden rounded-xl bg-muted"
            >
              <Image
                src={image.url}
                alt={image.alt}
                width={800}
                height={800}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/20 group-hover:opacity-100">
                <div className="flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur-sm">
                  <ExpandIcon className="size-4" />
                </div>
              </div>
              {image.caption && (
                <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-6 pb-2 text-left text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {image.caption}
                </p>
              )}
            </button>
          </SlideUp>
        ))}
      </div>

      <Dialog
        open={activeIndex !== null}
        onOpenChange={(open) => !open && setActiveIndex(null)}
      >
        <DialogPortal>
          <DialogOverlay className="bg-black/80" />
          <DialogPrimitive.Popup
            onClick={closeIfBackground}
            className="fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100%-2rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 rounded-none bg-transparent p-4 text-sm shadow-none ring-0 outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:max-w-[calc(100%-4rem)] sm:p-10"
          >
            {activeImage && (
              <>
                <div
                  onClick={closeIfBackground}
                  className="relative flex max-h-full max-w-full items-center justify-center"
                >
                  <Image
                    src={activeImage.url}
                    alt={activeImage.alt}
                    width={1600}
                    height={1600}
                    sizes="100vw"
                    className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain"
                    priority
                  />
                </div>
                {activeImage.caption && (
                  <p className="max-w-2xl text-center text-sm text-white/80">{activeImage.caption}</p>
                )}
              </>
            )}
            <DialogClose
              render={
                <button
                  type="button"
                  className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur-sm"
                />
              }
            >
              <XIcon className="size-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogPrimitive.Popup>
        </DialogPortal>
      </Dialog>
    </>
  )
}

export { ProjectGallery }
