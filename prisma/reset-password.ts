import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);
  
  const result = await prisma.user.updateMany({
    data: {
      password: hashedPassword
    }
  });

  console.log(`Successfully reset passwords for ${result.count} users to: 123456`);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
