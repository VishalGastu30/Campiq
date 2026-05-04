const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: "postgresql://neondb_owner:npg_DRH7kteb1KLl@ep-raspy-glade-amd00brp.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require" } }
});
async function main() {
  const colleges = await prisma.college.findMany({
    orderBy: { nirfRank: { sort: 'asc', nulls: 'last' } },
    take: 6
  });
  console.log(`Returned ${colleges.length} colleges`);
}
main().finally(() => prisma.$disconnect());
