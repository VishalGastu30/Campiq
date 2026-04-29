-- CreateEnum
CREATE TYPE "CollegeType" AS ENUM ('PRIVATE', 'GOVERNMENT', 'DEEMED', 'AUTONOMOUS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colleges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "bannerUrl" TEXT,
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "type" "CollegeType" NOT NULL,
    "establishedYear" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "minFees" INTEGER NOT NULL,
    "maxFees" INTEGER NOT NULL,
    "nirfRank" INTEGER,
    "naacGrade" TEXT,
    "placementPercent" DOUBLE PRECISION,
    "avgPackage" DOUBLE PRECISION,
    "highestPackage" DOUBLE PRECISION,
    "topRecruiters" TEXT[],
    "about" TEXT NOT NULL,
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "ugcApproved" BOOLEAN NOT NULL DEFAULT false,
    "aiuMember" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colleges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "fees" INTEGER NOT NULL,
    "seats" INTEGER,
    "category" TEXT NOT NULL,
    "eligibility" TEXT,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_colleges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_colleges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "colleges_slug_key" ON "colleges"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "saved_colleges_userId_collegeId_key" ON "saved_colleges"("userId", "collegeId");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_colleges" ADD CONSTRAINT "saved_colleges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_colleges" ADD CONSTRAINT "saved_colleges_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
