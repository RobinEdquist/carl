import type { Metadata } from "next"
import Gallery from "@/components/gallery"

export const metadata: Metadata = {
  title: "Carl Hjerpe | Photography",
  description: "Photography portfolio of Carl Hjerpe",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-medium tracking-tight mb-2">Carl Hjerpe</h1>
          <p className="text-muted-foreground font-light">Photography Portfolio</p>
        </header>
        <Gallery />
      </div>
    </main>
  )
}

