const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with example data...");

  // 1. Create a Course
  const course1 = await prisma.course.create({
    data: {
      title: 'ศิลปะการเลี้ยงลูกในยุคดิจิทัล',
      description: 'เรียนรู้วิธีการเลี้ยงลูกให้มีความสุขและปลอดภัยในยุคที่เต็มไปด้วยหน้าจอและโซเชียลมีเดีย',
      imageUrl: '/banner.png',
      videos: {
        create: [
          {
            title: 'บทที่ 1: เข้าใจพัฒนาการเด็กยุคอัลฟ่า',
            youtubeId: 'jNQXAC9IVRw', // Generic me at the zoo placeholder, or any safe ID
          },
          {
            title: 'บทที่ 2: การจำกัดเวลาหน้าจออย่างสร้างสรรค์',
            youtubeId: 'ScMzIvxBSi4', // generic
          },
          {
            title: 'บทที่ 3: ภัยเงียบจากโลกไซเบอร์',
            youtubeId: 'y8XvQNt26KI', // generic
          }
        ]
      }
    }
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'การจัดการการเงินสำหรับครอบครัว',
      description: 'เคล็ดลับการออมเงิน วางแผนค่าใช้จ่าย และเตรียมพร้อมสำหรับอนาคตของลูกรัก',
      imageUrl: '/logo.png',
      videos: {
        create: [
          {
            title: 'บทที่ 1: วางแผนรายรับรายจ่ายพื้นฐาน',
            youtubeId: 'ScMzIvxBSi4', 
          },
          {
            title: 'บทที่ 2: กองทุนเพื่อการศึกษาบุตร',
            youtubeId: 'jNQXAC9IVRw', 
          }
        ]
      }
    }
  });
  console.log("✅ Courses and Videos created");

  // 2. Create Posters (Banners)
  await prisma.poster.createMany({
    data: [
      {
        title: 'ครอบครัวมีสุข ยินดีต้อนรับ',
        imageUrl: '/banner.png',
      },
      {
        title: 'กิจกรรมครอบครัวสัมพันธ์',
        imageUrl: '/banner.png',
      }
    ]
  });
  console.log("✅ Posters created");

  // 3. Create Activities (News)
  await prisma.activity.createMany({
    data: [
      {
        title: 'งานสัมมนาครอบครัวยุคใหม่ เข้าใจลูกวัยรุ่น',
        description: 'ขอเชิญผู้ปกครองเข้าร่วมฟังสัมมนาฟรี โดยผู้เชี่ยวชาญด้านจิตวิทยาเด็ก ณ หอประชุมมหาวิทยาลัย',
        location: 'หอประชุมราชภัฏนครราชสีมา',
        imageUrl: '/banner.png',
        eventDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days from now
      },
      {
        title: 'กิจกรรมปลูกป่า สร้างสายใยครอบครัว',
        description: 'ร่วมทำกิจกรรมเพื่อสังคม ปลูกต้นไม้และเรียนรู้ธรรมชาติไปพร้อมกับลูกๆ',
        location: 'อุทยานแห่งชาติเขาใหญ่',
        imageUrl: '/banner.png',
        eventDate: new Date(new Date().setDate(new Date().getDate() + 14)), // 14 days from now
      }
    ]
  });
  console.log("✅ Activities created");

  // 4. Create Ebooks
  await prisma.ebook.createMany({
    data: [
      {
        title: 'คู่มือพ่อแม่มือใหม่',
        description: 'รวบรวมเกร็ดความรู้ตั้งแต่ตั้งครรภ์จนถึงวัยเตาะแตะ',
        coverUrl: '/logo.png',
        fileUrl: '#',
      },
      {
        title: 'เมนูอาหารเพื่อสุขภาพเด็ก',
        description: 'สูตรอาหารทำง่าย อร่อยและได้โภชนาการครบถ้วนสำหรับเด็กวัยกำลังโต',
        coverUrl: '/logo.png',
        fileUrl: '#',
      }
    ]
  });
  console.log("✅ Ebooks created");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
