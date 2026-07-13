import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const ebooks = [
    {
      title: "สื่อความรู้ ครอบครัวมีสุข 1",
      description: "เอกสารความรู้ที่เป็นประโยชน์สำหรับการดูแลสุขภาพและพัฒนาการของคนในครอบครัว",
      coverUrl: "/ebooks/33010_0.jpg",
      fileUrl: "#pending"
    },
    {
      title: "สื่อความรู้ ครอบครัวมีสุข 2",
      description: "เอกสารความรู้ที่เป็นประโยชน์สำหรับการดูแลสุขภาพและพัฒนาการของคนในครอบครัว",
      coverUrl: "/ebooks/33011_0.jpg",
      fileUrl: "#pending"
    },
    {
      title: "สื่อความรู้ ครอบครัวมีสุข 3",
      description: "เอกสารความรู้ที่เป็นประโยชน์สำหรับการดูแลสุขภาพและพัฒนาการของคนในครอบครัว",
      coverUrl: "/ebooks/33012_0.jpg",
      fileUrl: "#pending"
    },
    {
      title: "สื่อความรู้ ครอบครัวมีสุข 4",
      description: "เอกสารความรู้ที่เป็นประโยชน์สำหรับการดูแลสุขภาพและพัฒนาการของคนในครอบครัว",
      coverUrl: "/ebooks/33013_0.jpg",
      fileUrl: "#pending"
    },
    {
      title: "สื่อความรู้ ครอบครัวมีสุข 5",
      description: "เอกสารความรู้ที่เป็นประโยชน์สำหรับการดูแลสุขภาพและพัฒนาการของคนในครอบครัว",
      coverUrl: "/ebooks/33014_0.jpg",
      fileUrl: "#pending"
    },
    {
      title: "สื่อความรู้ ครอบครัวมีสุข 6",
      description: "เอกสารความรู้ที่เป็นประโยชน์สำหรับการดูแลสุขภาพและพัฒนาการของคนในครอบครัว",
      coverUrl: "/ebooks/33015_0.jpg",
      fileUrl: "#pending"
    },
    {
      title: "สื่อความรู้ ครอบครัวมีสุข 7",
      description: "เอกสารความรู้ที่เป็นประโยชน์สำหรับการดูแลสุขภาพและพัฒนาการของคนในครอบครัว",
      coverUrl: "/ebooks/33016_0.jpg",
      fileUrl: "#pending"
    }
  ];

  for (const book of ebooks) {
    await prisma.ebook.create({
      data: book
    });
    console.log(`Created ${book.title}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
