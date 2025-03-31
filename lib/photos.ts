import type {Photo} from "@/types/photo"

// This is a placeholder function that would be replaced with actual API calls
// or data fetching logic in a real application
export async function getPhotos(): Promise<Photo[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Define different aspect ratios for variety
    // const variations = [
    //     {width: 800, height: 800}, // 1:1
    //     {width: 800, height: 1067}, // 3:4
    //     {width: 1067, height: 800}, // 4:3
    //     {width: 1200, height: 675}, // 16:9
    //     {width: 675, height: 1200}, // 9:16
    //     {width: 800, height: 1200}, // 2:3
    //     {width: 1200, height: 800}, // 3:2
    // ]

    // Return mock data with varied sizes

    return [
        {id: "1", src: "/DSCF5311.jpg", },
    ]
}

