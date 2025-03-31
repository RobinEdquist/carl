export interface ExifData {
  make?: string
  model?: string
  focalLength?: string
  aperture?: string
  shutterSpeed?: string
  iso?: string
  dateTaken?: string
  [key: string]: string | undefined
}

export interface Photo {
  id: string
  src: string
  title?: string
  exif?: ExifData
  aspectRatio?: string
  span?: number
  width?: number
  height?: number
    objectPosition?: string
}

