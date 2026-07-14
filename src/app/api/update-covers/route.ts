import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const sourceDir = 'C:\\Users\\Lenovo\\Desktop\\happy family\\ปก\\วิชา';
    const destDir = path.join(process.cwd(), 'public', 'covers');
    
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const subjects = await prisma.subject.findMany();
    const files = fs.readdirSync(sourceDir);
    let logs = [];

    // 1. Course cover (just use the first subject's cover for the single course if it exists)
    const courses = await prisma.course.findMany();
    if (courses.length > 0 && files.length > 0) {
      const firstImg = files.find(f => !fs.statSync(path.join(sourceDir, f)).isDirectory());
      if (firstImg) {
        const ext = path.extname(firstImg);
        const newName = `course-${courses[0].id}${ext}`;
        fs.copyFileSync(path.join(sourceDir, firstImg), path.join(destDir, newName));
        await prisma.course.update({
          where: { id: courses[0].id },
          data: { imageUrl: `/covers/${newName}` }
        });
        logs.push(`Updated course ${courses[0].title} with /covers/${newName}`);
      }
    }

    // 2. Subjects
    for (const subject of subjects) {
      const matchingFile = files.find(f => f.includes(subject.title) && !fs.statSync(path.join(sourceDir, f)).isDirectory());
      if (matchingFile) {
        const ext = path.extname(matchingFile);
        const newName = `subject-${subject.id}${ext}`;
        fs.copyFileSync(path.join(sourceDir, matchingFile), path.join(destDir, newName));
        
        await prisma.subject.update({
          where: { id: subject.id },
          data: { imageUrl: `/covers/${newName}` }
        });
        logs.push(`Updated subject ${subject.title} with /covers/${newName}`);
      }
    }

    // 3. Videos
    const subDirs = files.filter(f => fs.statSync(path.join(sourceDir, f)).isDirectory());
    for (const dir of subDirs) {
      const matchingSubject = subjects.find(s => dir.includes(s.title));
      if (matchingSubject) {
        const videos = await prisma.video.findMany({ where: { subjectId: matchingSubject.id } });
        const videoImages = fs.readdirSync(path.join(sourceDir, dir));
        
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
            logs.push(`Updated video ${video.title} with /covers/${newName}`);
            i++;
          }
        }
      }
    }

    return NextResponse.json({ success: true, logs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
  }
}
