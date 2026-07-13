import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const course = await prisma.course.create({
    data: {
      title: 'หลักสูตรส่งเสริมสุขภาพใจ (Mental Health)',
      description: 'เรียนรู้วิธีการจัดการความเครียด และการส่งเสริมสุขภาพจิตใจที่ดีสำหรับทุกช่วงวัย',
      subjects: {
        create: [
          {
            title: 'หมวดหมู่ทั่วไป',
            description: 'วิชาพื้นฐาน',
            videos: {
              create: [
                {
                  title: 'บทที่ 1: การจัดการความเครียดเบื้องต้น',
                  youtubeId: 'dQw4w9WgXcQ'
                },
                {
                  title: 'บทที่ 2: ภูมิปัญญาท้องถิ่นกับการดูแลสุขภาพ',
                  youtubeId: 'jNQXAC9IVRw'
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Seed completed!', course);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
