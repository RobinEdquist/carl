"use client"

import {useState, useEffect, useRef} from "react"
import Image from "next/image"
import Lightbox from "@/components/lightbox"
import {Skeleton} from "@/components/ui/skeleton"
import {getPhotos} from "@/lib/photos"
import type {Photo} from "@/types/photo"
import {cn} from "@/lib/utils";

export default function Gallery() {
    const [photos, setPhotos] = useState<Photo[]>([])
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
    const [loading, setLoading] = useState(true)
    const [columns, setColumns] = useState(4)
    const galleryRef = useRef<HTMLDivElement>(null)

    // Determine number of columns based on screen width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setColumns(1)
            } else if (window.innerWidth < 768) {
                setColumns(2)
            } else if (window.innerWidth < 1024) {
                setColumns(3)
            } else {
                setColumns(4)
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        const loadPhotos = async () => {
            try {
                const photoData = await getPhotos()
                setPhotos(photoData)
            } catch (error) {
                console.error("Failed to load photos:", error)
            } finally {
                setLoading(false)
            }
        }

        loadPhotos()
    }, [])

    // Distribute photos into columns
    const getPhotoColumns = () => {

        const photoColumns: Photo[][] = Array.from({length: columns}, () => [])

        if (photos.length > 0) {
            // Distribute photos into columns
            photos.forEach((photo, index) => {
                // Find the shortest column
                const shortestColumnIndex = photoColumns
                    .map((column, i) => ({
                        height: column.reduce((sum, photo) => sum + (photo.height || 300) / (photo.width || 300), 0),
                        index: i,
                    }))
                    .sort((a, b) => a.height - b.height)[0].index

                photoColumns[shortestColumnIndex].push(photo)
            })
        }

        return photoColumns
    }

    const photoColumns = getPhotoColumns()

    return (
        <>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({length: 12}).map((_, i) => (
                        <div key={i} className="aspect-square relative">
                            <Skeleton className="w-full h-full absolute inset-0"/>
                        </div>
                    ))}
                </div>
            ) : (
                <div ref={galleryRef} className="flex gap-4">
                    {photoColumns.map((column, columnIndex) => (
                        <div key={columnIndex} className="flex-1 flex flex-col gap-4">
                            {column.map((photo) => (
                                <div
                                    key={photo.id}
                                    id={photo.id}
                                    className="relative cursor-pointer group overflow-hidden rounded-md"
                                    onClick={() => setSelectedPhoto(photo)}
                                    style={{
                                        // paddingBottom: `${((photo.height || 300) / (photo.width || 300)) * 100}%`,
                                    }}
                                >
                                    <div className="absolute inset-0">

                                        <Image
                                            src={photo.src || "/placeholder.svg"}
                                            alt={photo.title || "Photograph by Carl Hjerpe"}
                                            onLoad={(res) =>{
                                                const img = res.currentTarget as HTMLImageElement;
                                                const imgContainerParent = img.parentElement?.parentElement as HTMLDivElement;
                                                const imgContainer = img.parentElement as HTMLDivElement;

                                                if (img.naturalWidth && img.naturalHeight) {
                                                    const aspectRatio = img.naturalHeight / img.naturalWidth;
                                                    console.log(`height ${photo.id}`, aspectRatio * img.getBoundingClientRect().width);
                                                    const setHeight = aspectRatio * img.getBoundingClientRect().width;
                                                        img.style.height = setHeight + "px";
                                                        imgContainerParent.style.height = `${setHeight}px`;
                                                        imgContainer.style.height = `${setHeight}px`;
                                                }

                                            } }
                                            fill
                                            // sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            className={ cn("object-cover transition-transform duration-300 group-hover:scale-105")}
                                            style={{objectPosition: photo.objectPosition || "center"}}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {selectedPhoto && <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)}/>}
        </>
    )
}

