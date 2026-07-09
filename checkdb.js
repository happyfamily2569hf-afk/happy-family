const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const videos = await prisma.video.findMany({ take: 3 });
  console.log(videos);
}
main().finally(() => prisma.$disconnect());
