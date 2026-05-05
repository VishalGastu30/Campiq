import { PrismaClient, Stream } from '@prisma/client';

const prisma = new PrismaClient();

const streamCourseTemplates: Record<string, any[]> = {
  ENGINEERING: [
    { name: 'B.Tech Computer Science Engineering', shortName: 'B.Tech CSE', duration: 4, degree: 'B.Tech', seats: 120, eligibility: '10+2 with 60% in PCM' },
    { name: 'B.Tech Mechanical Engineering', shortName: 'B.Tech ME', duration: 4, degree: 'B.Tech', seats: 60, eligibility: '10+2 with 60% in PCM' },
    { name: 'B.Tech Electronics & Communication', shortName: 'B.Tech ECE', duration: 4, degree: 'B.Tech', seats: 60, eligibility: '10+2 with 60% in PCM' },
  ],
  MANAGEMENT: [
    { name: 'Master of Business Administration', shortName: 'MBA', duration: 2, degree: 'MBA', seats: 120, eligibility: 'Graduation with 50% + CAT/MAT' },
    { name: 'Bachelor of Business Administration', shortName: 'BBA', duration: 3, degree: 'BBA', seats: 60, eligibility: '10+2 with 50%' },
  ],
  MEDICAL: [
    { name: 'Bachelor of Medicine and Bachelor of Surgery', shortName: 'MBBS', duration: 5, degree: 'MBBS', seats: 150, eligibility: '10+2 with PCB + NEET' },
    { name: 'Doctor of Medicine', shortName: 'MD', duration: 3, degree: 'MD', seats: 30, eligibility: 'MBBS + NEET PG' },
  ],
  LAW: [
    { name: 'Bachelor of Laws', shortName: 'LLB', duration: 3, degree: 'LLB', seats: 60, eligibility: 'Graduation with 45%' },
    { name: 'B.A. L.L.B.', shortName: 'BA LLB', duration: 5, degree: 'BA LLB', seats: 60, eligibility: '10+2 with 45% + CLAT' },
  ],
  ARTS: [
    { name: 'Bachelor of Arts (Hons) Economics', shortName: 'BA Economics', duration: 3, degree: 'BA', seats: 60, eligibility: '10+2 with 50%' },
    { name: 'Bachelor of Arts (Hons) English', shortName: 'BA English', duration: 3, degree: 'BA', seats: 60, eligibility: '10+2 with 50%' },
  ],
  SCIENCE: [
    { name: 'Bachelor of Science (Hons) Physics', shortName: 'B.Sc Physics', duration: 3, degree: 'B.Sc', seats: 40, eligibility: '10+2 with PCM/PCB' },
    { name: 'Bachelor of Science (Hons) Chemistry', shortName: 'B.Sc Chemistry', duration: 3, degree: 'B.Sc', seats: 40, eligibility: '10+2 with PCM/PCB' },
  ],
  COMMERCE: [
    { name: 'Bachelor of Commerce (Hons)', shortName: 'B.Com', duration: 3, degree: 'B.Com', seats: 120, eligibility: '10+2 with 50%' },
    { name: 'Master of Commerce', shortName: 'M.Com', duration: 2, degree: 'M.Com', seats: 40, eligibility: 'B.Com with 50%' },
  ],
  DESIGN: [
    { name: 'Bachelor of Design', shortName: 'B.Des', duration: 4, degree: 'B.Des', seats: 60, eligibility: '10+2 in any stream' },
    { name: 'Master of Design', shortName: 'M.Des', duration: 2, degree: 'M.Des', seats: 30, eligibility: 'B.Des/B.Arch/B.Tech' },
  ],
  PHARMACY: [
    { name: 'Bachelor of Pharmacy', shortName: 'B.Pharm', duration: 4, degree: 'B.Pharm', seats: 60, eligibility: '10+2 with PCM/PCB' },
  ],
  AGRICULTURE: [
    { name: 'B.Sc (Hons.) Agriculture', shortName: 'B.Sc Agri', duration: 4, degree: 'B.Sc', seats: 60, eligibility: '10+2 with PCB/PCM/Agriculture' },
  ]
};

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('🚀 Seeding realistic courses for colleges...');
  
  // Wipe existing courses
  await prisma.course.deleteMany({});
  console.log('Cleared existing courses.');

  const colleges = await prisma.college.findMany({
    select: { id: true, streams: true, minFees: true, maxFees: true, name: true }
  });

  const coursesToInsert: any[] = [];

  for (const college of colleges) {
    // Determine base fee for this college's courses based on its min/max fees
    const baseFee = college.minFees || 100000;
    
    for (const stream of college.streams) {
      const templates = streamCourseTemplates[stream] || streamCourseTemplates['SCIENCE'];
      
      for (const tpl of templates) {
        // Generate a fee around the college's base fee, adding some randomness
        let fee = baseFee + getRandomInt(-20000, 50000);
        if (fee < 10000) fee = 10000;
        
        coursesToInsert.push({
          name: tpl.name,
          shortName: tpl.shortName,
          duration: tpl.duration,
          degree: tpl.degree,
          stream: stream,
          fees: fee,
          seats: tpl.seats,
          collegeId: college.id,
        });
      }
    }
  }

  // Insert in batches
  const batchSize = 1000;
  for (let i = 0; i < coursesToInsert.length; i += batchSize) {
    const batch = coursesToInsert.slice(i, i + batchSize);
    await prisma.course.createMany({
      data: batch
    });
    console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} of courses`);
  }

  console.log(`✅ Successfully seeded ${coursesToInsert.length} courses across ${colleges.length} colleges.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
