"use client"

import {useCallback, useEffect, useState} from "react"
import Image from "next/image"
import { X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Photo } from "@/types/photo"
import exifr from 'exifr'

interface LightboxProps {
  photo: Photo
  onClose: () => void
}

export default function Lightbox({ photo, onClose }: LightboxProps) {
  const [isOpen, setIsOpen] = useState(true)

  const [exifData, setExifData] = useState<any>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "auto"
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const MemoizedImage = useCallback(() => {
    return <Image
        onLoad={async (ev) => {

          const img = ev.currentTarget
          const response = await fetch(img.src);
          const blob = await response.blob();
          const metadata = await exifr.parse(blob);
          console.log('EXIF data:', metadata);
          setExifData(metadata);
        }}
        src={photo.src || "/placeholder.svg"}
        alt={photo.title || "Photograph by Carl Hjerpe"}
        width={photo.width || 1200}
        height={photo.height || 800}
        className="max-h-[85vh] max-w-[85vw] w-auto h-auto object-contain"
        priority
    />
  }, [])

  return (
    <div
      className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative aspect-auto">
          <MemoizedImage />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 rounded-full bg-background/50 hover:bg-background/70"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="text-sm bg-background/50 p-2 rounded-md backdrop-blur-sm">
            {photo.title && <p className="font-medium">{photo.title}</p>}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full bg-background/50 hover:bg-background/70">
                <Info className="h-5 w-5" />
                <span className="sr-only">Image Information</span>
              </Button>
            </SheetTrigger>
            <SheetContent className={"pr-0"}>
              <SheetHeader>
                <SheetTitle className="text-xl font-medium">Image Information</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 max-h-full overflow-y-auto pb-16">
                {exifData ? (
                  <ul className="space-y-2">
                    {Object.entries(exifData).map(([key, value]) => (
                      <li key={key} className="grid grid-cols-2 gap-2">
                        <p className="text-sm font-medium overflow-hidden overflow-ellipsis">{key}</p>
                        <p className="text-sm text-muted-foreground font-light overflow-hidden overflow-ellipsis">{value?.toString()}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground font-light">No EXIF data available</p>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}

