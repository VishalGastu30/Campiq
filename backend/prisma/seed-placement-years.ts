import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPlacementYears() {
  console.log("Seeding placement years for all colleges...");
  
  const colleges = await prisma.college.findMany({
    select: { id: true, placementPercent: true, avgPackage: true }
  });

  let createdCount = 0;

  for (const college of colleges) {
    const basePercent = college.placementPercent || 70;
    const basePackage = college.avgPackage || 5.0;

    const data = [
      {
        collegeId: college.id,
        year: 2022,
        percentage: Math.max(0, basePercent - Math.random() * 5 - 2),
        avgPackage: Math.max(0, basePackage - Math.random() * 1 - 0.5),
      },
      {
        collegeId: college.id,
        year: 2023,
        percentage: Math.max(0, basePercent - Math.random() * 3),
        avgPackage: Math.max(0, basePackage - Math.random() * 0.5),
      },
      {
        collegeId: college.id,
        year: 2024,
        percentage: basePercent,
        avgPackage: basePackage,
      }
    ];

    for (const record of data) {
      await prisma.placementYear.upsert({
        where: {
          collegeId_year: {
            collegeId: record.collegeId,
            year: record.year,
          }
        },
        update: record,
        create: record,
      });
      createdCount++;
    }
  }

  console.log(`✅ Upserted ${createdCount} placement year records.`);
  await prisma.$disconnect();
}

seedPlacementYears().catch(e => {
  console.error(e);
  process.exit(1);
});
