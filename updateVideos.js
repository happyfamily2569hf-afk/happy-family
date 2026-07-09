const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const videos = await prisma.video.findMany();
  
  const distinctIds = [
    'dQw4w9WgXcQ', // Video 1
    'jNQXAC9IVRw', // Video 2 (Me at the zoo)
    '9bZkp7q19f0'  // Video 3 (Gangnam style)
  ];

  for (let i = 0; i < videos.length; i++) {
    const newId = distinctIds[i % distinctIds.length];
    await prisma.video.update({
      where: { id: videos[i].id },
      data: { youtubeId: newId }
    });
    console.log(`Updated video ${videos[i].title} to youtubeId: ${newId}`);
  }
}

main().finally(() => prisma.$disconnect());
