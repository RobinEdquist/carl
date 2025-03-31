import type { ExifData } from "@/types/photo"

export function formatExifData(exif: ExifData) {
  const formatted: Record<string, string> = {}

  if (exif.make) formatted["Camera"] = exif.make
  if (exif.model) formatted["Model"] = exif.model
  if (exif.focalLength) formatted["Focal Length"] = exif.focalLength
  if (exif.aperture) formatted["Aperture"] = exif.aperture
  if (exif.shutterSpeed) formatted["Shutter Speed"] = exif.shutterSpeed
  if (exif.iso) formatted["ISO"] = exif.iso

  if (exif.dateTaken) {
    const date = new Date(exif.dateTaken)
    formatted["Date Taken"] = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return formatted
}

