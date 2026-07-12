const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const ebooks = [
    {
      title: "โปรแกรมครอบครัวสุขภาวะดี",
      description: "เครื่องมือสำหรับสร้างสุขภาพที่ดีในครอบครัว",
      coverUrl: "/uploads/ebooks/33010_0.jpg",
      fileUrl: "#"
    },
    {
      title: "กิจกรรมสร้างความสุขในครอบครัว",
      description: "กิจกรรมสร้างความสุขในครอบครัว",
      coverUrl: "/uploads/ebooks/33011_0.jpg",
      fileUrl: "#"
    },
    {
      title: "เทคโนโลยีกับสุขภาพครอบครัว",
      description: "เทคโนโลยีกับสุขภาพครอบครัว",
      coverUrl: "/uploads/ebooks/33012_0.jpg",
      fileUrl: "#"
    },
    {
      title: "การดูแลสุขภาพช่องปากทุกช่วงวัย",
      description: "การดูแลสุขภาพช่องปากทุกช่วงวัย",
      coverUrl: "/uploads/ebooks/33013_0.jpg",
      fileUrl: "#"
    },
    {
      title: "กินดี อยู่ดี สุขภาพดีทั้งบ้าน",
      description: "คู่มือการรับประทานอาหารเพื่อส่งเสริมและดูแลสุขภาพในครอบครัว",
      coverUrl: "/uploads/ebooks/33014_0.jpg",
      fileUrl: "#"
    },
    {
      title: "การสื่อสารสร้างรักในครอบครัว",
      description: "การสื่อสารสร้างรักในครอบครัว",
      coverUrl: "/uploads/ebooks/33015_0.jpg",
      fileUrl: "#"
    },
    {
      title: "สุขภาวะครอบครัว",
      description: "บ้านที่อบอุ่น เป็นรากฐานของสุขภาวะที่ดี",
      coverUrl: "/uploads/ebooks/33016_0.jpg",
      fileUrl: "#"
    }
  ];

  console.log("Starting to add ebooks...");
  for (const ebook of ebooks) {
    const created = await prisma.ebook.create({
      data: ebook
    });
    console.log(`Added: ${created.title}`);
  }
  console.log("Finished adding ebooks.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
