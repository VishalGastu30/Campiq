// prisma/seed.ts
import { PrismaClient, CollegeType, Stream } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parse/sync';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  
  // Clear existing data
  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  // Load CSV
  const csvPath = path.join(__dirname, 'data', 'colleges.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found at ${csvPath}`);
    return;
  }
  const raw = fs.readFileSync(csvPath, 'utf-8');
  const rows = csv.parse(raw, { columns: true, skip_empty_lines: true });

  for (const r of rows) {
    const row = r as any;
    // Generate slug from name — e.g. "IIT Madras" → "iit-madras"
    const name = row.name || 'Unknown';
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Fix map streams if it's empty
    const rawStreams = row.streams || row.courses || '';
    const streams = rawStreams.split(',').map((s: string) => {
        const parsed = s.trim().toUpperCase();
        return parsed as Stream;
    }).filter((s: Stream) => Object.values(Stream).includes(s));

    let type: CollegeType = CollegeType.PRIVATE;
    const rawType = row.type ? row.type.toUpperCase() : '';
    if (Object.values(CollegeType).includes(rawType as CollegeType)) {
        type = rawType as CollegeType;
    } else if (rawType.includes('GOV')) {
        type = CollegeType.GOVERNMENT;
    } else if (rawType.includes('DEEM')) {
        type = CollegeType.DEEMED;
    } else if (rawType.includes('CENTRAL')) {
        type = CollegeType.CENTRAL;
    }

    await prisma.college.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        name: name,
        city: row.city || 'Unknown',
        state: row.state || 'Unknown',
        type: type,
        nirfRank: row.nirf_rank ? parseInt(row.nirf_rank) : null,
        minFees: row.min_fees ? parseInt(row.min_fees) : null,
        maxFees: row.max_fees ? parseInt(row.max_fees) : null,
        placementPercent: row.placement_percent ? parseFloat(row.placement_percent) : null,
        avgPackage: row.avg_package ? parseFloat(row.avg_package) : null,
        naacGrade: row.naac_grade || null,
        streams: streams.length > 0 ? streams : [Stream.ENGINEERING],
        examsAccepted: row.exams ? row.exams.split(',').map((e: string) => e.trim()) : [],
        about: row.about || null,
        imageUrl: row.image_url || null,
      },
    });
  }

  console.log(`✅ Seeded ${rows.length} colleges`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
