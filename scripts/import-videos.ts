import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function importVideos() {
  try {
    console.log('Importing hero videos...')

    // Clear existing videos
    await prisma.heroVideo.deleteMany({})
    console.log('Cleared existing videos')

    // Import videos 1-21
    const videos = []
    for (let i = 1; i <= 21; i++) {
      videos.push({
        fileName: `${i}.mp4`,
        order: i - 1,
        active: true
      })
    }

    // Create all videos
    for (const video of videos) {
      await prisma.heroVideo.create({
        data: video
      })
      console.log(`Added: ${video.fileName}`)
    }

    console.log(`\n✅ Successfully imported ${videos.length} videos!`)
  } catch (error) {
    console.error('Error importing videos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importVideos()
