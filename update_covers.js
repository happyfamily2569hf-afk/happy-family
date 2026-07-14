const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8').split('\n');
  envConfig.forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.join('=').trim().replace(/^['"]|['"]$/g, '');
    }
  });
}
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sourceDir = 'C:\\Users\\Lenovo\\Desktop\\happy family\\ปก\\วิชา';
  const destDir = path.join(__dirname, 'public', 'covers');
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // 1. Subjects
  const subjects = await prisma.subject.findMany();
  console.log('Found subjects:', subjects.map(s => s.title));

  const files = fs.readdirSync(sourceDir);
  for (const subject of subjects) {
    // Find matching image for subject
    const matchingFile = files.find(f => f.includes(subject.title) && !fs.statSync(path.join(sourceDir, f)).isDirectory());
    if (matchingFile) {
      const ext = path.extname(matchingFile);
      const newName = `subject-${subject.id}${ext}`;
      fs.copyFileSync(path.join(sourceDir, matchingFile), path.join(destDir, newName));
      
      await prisma.subject.update({
        where: { id: subject.id },
        data: { imageUrl: `/covers/${newName}` }
      });
      console.log(`Updated subject ${subject.title} with /covers/${newName}`);
    } else {
      console.log(`No cover found for subject: ${subject.title}`);
    }
  }

  // 2. Videos
  // Map directories to subjects
  const subDirs = files.filter(f => fs.statSync(path.join(sourceDir, f)).isDirectory());
  for (const dir of subDirs) {
    const matchingSubject = subjects.find(s => dir.includes(s.title));
    if (matchingSubject) {
      const videos = await prisma.video.findMany({ where: { subjectId: matchingSubject.id }, orderBy: { order: 'asc' } });
      const videoImages = fs.readdirSync(path.join(sourceDir, dir));
      
      // Sort video images just to have deterministic assignment (assuming alphabetical is fine, or just sequential)
      // Usually they are named randomly like Gemini_Generated_Image_37tjdo...
      let i = 0;
      for (const video of videos) {
        if (i < videoImages.length) {
          const vImg = videoImages[i];
          const ext = path.extname(vImg);
          const newName = `video-${video.id}${ext}`;
          fs.copyFileSync(path.join(sourceDir, dir, vImg), path.join(destDir, newName));
          
          await prisma.video.update({
            where: { id: video.id },
            data: { imageUrl: `/covers/${newName}` }
          });
          console.log(`Updated video ${video.title} with /covers/${newName}`);
          i++;
        }
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
