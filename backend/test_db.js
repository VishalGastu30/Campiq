const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: "postgresql://neondb_owner:npg_DRH7kteb1KLl@ep-raspy-glade-amd00brp.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require" } }
});
async function main() {
  const count = await prisma.college.count();
  console.log(`Colleges count: ${count}`);
}
main().finally(() => prisma.$disconnect());
