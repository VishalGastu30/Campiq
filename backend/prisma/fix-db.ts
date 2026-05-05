import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing NIRF ranks...');
  const res = await prisma.$executeRaw`UPDATE "College" SET "nirfRank" = NULL WHERE "nirfRank" = 0;`;
  console.log(`Updated ${res} colleges.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
