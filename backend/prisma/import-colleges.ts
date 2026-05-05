import { PrismaClient, CollegeType, Stream } from '@prisma/client';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

const prisma = new PrismaClient();

function safeInt(val: any, fallback: number | null = null): number | null {
  if (!val || val.trim() === '') return fallback;
  const n = parseInt(val);
  return isNaN(n) ? fallback : n;
}

function safeFloat(val: any, fallback: number | null = null): number | null {
  if (!val || val.trim() === '') return fallback;
  const n = parseFloat(val);
  return isNaN(n) ? fallback : n;
}

function safeBool(val: any, fallback: boolean = false): boolean {
  if (!val || val.trim() === '') return fallback;
  const v = val.toLowerCase();
  if (v === 'true' || v === 'yes' || v === '1') return true;
  return false;
}

function parseArray(val: string): string[] {
  if (!val) return [];
  return val.split(',').map(s => s.trim()).filter(s => s !== '');
}

async function importColleges() {
  const csvPath = path.join(__dirname, '../../colleges.csv');
  const raw = fs.readFileSync(csvPath, 'utf-8');
  
  const records = parse(raw, { 
    columns: true, 
    skip_empty_lines: true 
  });

  console.log(`Found ${records.length} colleges to import`);
  let imported = 0;
  let skipped = 0;

  for (const row of records as any[]) {
    const name = row.name;
    const slug = row.slug;
    
    if (!name || !slug) {
      skipped++;
      continue;
    }

    try {
      const typeStr = row.type as keyof typeof CollegeType;
      const typeEnum = CollegeType[typeStr] || CollegeType.PRIVATE;
      
      const streamStr = row.streams;
      const streams = streamStr ? [Stream[streamStr as keyof typeof Stream]].filter(Boolean) : [];

      const topRecruiters = parseArray(row.top_recruiters);
      const examsAccepted = parseArray(row.exams_accepted);
      const highlights = parseArray(row.highlights);

      await prisma.college.upsert({
        where: { slug: slug },
        update: {
          name: name,
          shortName: row.short_name || null,
          city: row.city,
          state: row.state,
          type: typeEnum,
          establishedYear: safeInt(row.established_year),
          nirfRank: safeInt(row.nirf_rank),
          nirfScore: safeFloat(row.nirf_score),
          naacGrade: row.naac_grade || null,
          minFees: safeInt(row.min_fees),
          maxFees: safeInt(row.max_fees),
          placementPercent: safeFloat(row.placement_percent),
          avgPackage: safeFloat(row.avg_package),
          highestPackage: safeFloat(row.highest_package),
          topRecruiters,
          examsAccepted,
          streams,
          about: row.about || null,
          highlights,
          website: row.website || null,
          rating: safeFloat(row.rating, 4.0), // Give a default rating of 4.0
          location: `${row.city}, ${row.state}`,
        },
        create: {
          slug: slug,
          name: name,
          shortName: row.short_name || null,
          city: row.city,
          state: row.state,
          type: typeEnum,
          establishedYear: safeInt(row.established_year),
          nirfRank: safeInt(row.nirf_rank),
          nirfScore: safeFloat(row.nirf_score),
          naacGrade: row.naac_grade || null,
          minFees: safeInt(row.min_fees),
          maxFees: safeInt(row.max_fees),
          placementPercent: safeFloat(row.placement_percent),
          avgPackage: safeFloat(row.avg_package),
          highestPackage: safeFloat(row.highest_package),
          topRecruiters,
          examsAccepted,
          streams,
          about: row.about || null,
          highlights,
          website: row.website || null,
          rating: safeFloat(row.rating, 4.0), // Default rating
          location: `${row.city}, ${row.state}`,
          dataSource: "NIRF 2024",
        }
      });
      imported++;
      
      if (imported % 50 === 0) {
        console.log(`Imported ${imported}/${records.length}`);
      }
    } catch (e) {
      console.error(`Error importing ${name}:`, e);
      skipped++;
    }
  }

  console.log(`✅ Imported/Updated: ${imported} | Skipped: ${skipped}`);
  await prisma.$disconnect();
}

importColleges().catch(e => {
  console.error(e);
  process.exit(1);
});
