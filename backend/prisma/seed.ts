import { PrismaClient, CollegeType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.course.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Demo User...');
  const passwordHash = await bcrypt.hash('DemoPass123', 10);
  await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@campiq.in',
      password: passwordHash
    }
  });

  const csvPath = path.join(__dirname, 'data', 'colleges.csv');
  console.log(`Reading colleges from ${csvPath}...`);
  
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const records: any[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  console.log(`Parsed ${records.length} records. Seeding colleges...`);
  
  let successCount = 0;
  
  for (const record of records) {
    try {
      // Clean data
      const minFees = parseInt(record.min_fees) || 0;
      const maxFees = parseInt(record.max_fees) || 0;
      const rating = parseFloat(record.rating) || 3.5;
      const totalRatings = parseInt(record.total_ratings) || 0;
      const establishedYear = parseInt(record.established_year) || 2000;
      const placementPercent = parseFloat(record.placement_percent) || 0;
      const avgPackage = parseFloat(record.avg_package) || 0;
      const highestPackage = parseFloat(record.highest_package) || 0;
      const nirfRank = record.nirf_rank ? parseInt(record.nirf_rank) : null;
      
      const recruiters = record.top_recruiters ? record.top_recruiters.split('|').map((s: string) => s.trim()).filter(Boolean) : [];
      
      let type: CollegeType = 'PRIVATE';
      if (['GOVERNMENT', 'PRIVATE', 'DEEMED', 'AUTONOMOUS'].includes(record.type)) {
        type = record.type as CollegeType;
      }
      
      const courses = [];
      if (record.courses_offered) {
        const courseNames = record.courses_offered.split('|');
        for (const cName of courseNames) {
          const cat = record.nirf_category || 'General';
          courses.push({
            name: cName.trim(),
            degree: cName.trim().split(' ')[0],
            duration: cName.includes('Tech') ? 4 : (cName.includes('MBA') ? 2 : 3),
            fees: minFees,
            seats: 120,
            category: cat,
            eligibility: 'Merit/Entrance'
          });
        }
      } else {
         courses.push({
            name: `B.Tech ${record.nirf_category || 'Engineering'}`,
            degree: 'B.Tech',
            duration: 4,
            fees: minFees,
            seats: 120,
            category: record.nirf_category || 'Engineering',
            eligibility: 'Entrance'
          });
      }

      await prisma.college.upsert({
        where: { slug: record.slug },
        update: {},
        create: {
          name: record.name,
          slug: record.slug,
          city: record.city,
          state: record.state,
          location: `${record.city}, ${record.state}`,
          type,
          establishedYear,
          rating,
          totalRatings,
          minFees,
          maxFees,
          nirfRank,
          naacGrade: record.naac_grade || null,
          placementPercent,
          avgPackage,
          highestPackage,
          topRecruiters: recruiters,
          about: record.about || `${record.name} is a leading college in ${record.city}.`,
          website: record.website || null,
          ugcApproved: record.ugc_approved === 'True' || record.ugc_approved === 'true',
          aiuMember: false,
          courses: {
            create: courses
          }
        }
      });
      successCount++;
    } catch (e) {
      console.error(`Failed to seed ${record.name}:`, e);
    }
  }
  
  console.log(`✅ Seeded ${successCount} colleges successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
