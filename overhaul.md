# 🚀 CAMPIQ — COMPLETE OVERHAUL PLAN (PART 2)
> **Mission:** Build a better version of Collegedunia — not a clone, not a feature checklist, but a genuinely student-first decision tool that makes evaluators say "this person thinks like a product engineer."

---

## 📋 TABLE OF CONTENTS

1. [What We're Changing & Why](#1-what-were-changing--why)
2. [Tech Stack (Final)](#2-tech-stack-final)
3. [Database — Schema Overhaul](#3-database--schema-overhaul)
4. [Real Data Strategy](#4-real-data-strategy)
5. [Backend — Complete Architecture](#5-backend--complete-architecture)
6. [Groq AI Recommender](#6-groq-ai-recommender)
7. [Frontend — Full Overhaul Plan](#7-frontend--full-overhaul-plan)
8. [Stitch UI Prompt (Google Antigravity MCP)](#8-stitch-ui-prompt-google-antigravity-mcp)
9. [SEO Strategy](#9-seo-strategy)
10. [Feature Deep Dives](#10-feature-deep-dives)
11. [Engineering Quality Checklist](#11-engineering-quality-checklist)
12. [GitHub Commit Strategy](#12-github-commit-strategy)
13. [Deployment Guide (All Free)](#13-deployment-guide-all-free)
14. [Technical Notes Document Template](#14-technical-notes-document-template)
15. [Day-by-Day Build Plan](#15-day-by-day-build-plan)

---

## 1. What We're Changing & Why

### What Already Exists (From Task 1)
- Basic Next.js frontend deployed on Vercel
- Express + TypeScript backend deployed on Render/Railway
- PostgreSQL on Neon/Supabase
- Basic college listing, detail, compare, auth, saved
- Seeded data (likely placeholder or partial real data)

### What Changes in This Overhaul

| Area | Before | After |
|------|--------|-------|
| UI | Functional, basic | Award-winning, premium, decision-focused |
| Data | Seeded/placeholder | Real NIRF 2024 data, 200+ colleges |
| Compare | Side-by-side table | **Winner-highlighting**, shareable URL, persistent |
| Filters | Basic dropdowns | URL-synced, mobile drawer, multi-select |
| AI | Not present | Groq LLaMA recommender with modal UX |
| SEO | None | Dynamic metadata, sitemap, robots.txt, OG tags |
| Error handling | Partial | Global handler, every state covered |
| Mobile | Partially responsive | Full mobile-first pass at 375px |
| Performance | Okay | SSR on key pages, debounced search, AbortController |
| Animations | Minimal | Premium: GSAP/Framer Motion on all key interactions |
| Tech notes | None | Concise architecture decision document |
| Commits | Likely messy | Clean, conventional commits that tell a story |

### Why We're Not Rebuilding From Scratch
The backend schema and API routes are sound. Rewriting them wastes time that should go into polish, real data, and the AI feature. We're surgically upgrading, not demolishing.

---

## 2. Tech Stack (Final)

### Frontend
```
Framework:        Next.js 14 (App Router)
Language:         TypeScript
Styling:          Tailwind CSS + CSS Variables for theme tokens
Animations:       Framer Motion (preferred) or GSAP
Icons:            Lucide React
State:            Zustand (lightweight, no boilerplate)
Data fetching:    TanStack Query (React Query) — handles caching, loading, error states
HTTP client:      Axios with interceptors
Forms:            React Hook Form + Zod
```

### Backend
```
Runtime:          Node.js
Framework:        Express.js
Language:         TypeScript
ORM:              Prisma
Validation:       Zod
Auth:             JWT (jsonwebtoken) + bcrypt
AI:               Groq SDK (llama-3.3-70b-versatile)
Security:         Helmet.js, express-rate-limit, cors
```

### Database
```
DB:               PostgreSQL
Host:             Neon (free tier, serverless Postgres — zero config)
Migrations:       Prisma Migrate
Seeding:          Prisma Seed script (ts-node)
```

### Deployment
```
Frontend:         Vercel (free)
Backend:          Render (free tier)
Database:         Neon (free tier)
```

---

## 3. Database — Schema Overhaul

### Why the Schema Needs to Change
The Task 1 schema was minimal. For real data and the AI recommender to work properly, we need richer relationships and more fields.

### Final Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model College {
  id                String   @id @default(cuid())
  slug              String   @unique  // e.g. "iit-madras" — used in URLs
  name              String
  shortName         String?  // "IIT Madras"
  city              String
  state             String
  type              CollegeType  // GOVERNMENT, PRIVATE, DEEMED
  establishedYear   Int?
  nirfRank          Int?     // NIRF 2024 rank (null if not ranked)
  nirfScore         Float?
  naacGrade         String?  // "A++", "A+", "A", "B++", etc.
  affiliatedTo      String?  // "Anna University", "Autonomous", etc.
  
  // Fees
  minFees           Int?     // Annual fees in INR (minimum course)
  maxFees           Int?     // Annual fees in INR (maximum course)
  
  // Placements
  placementPercent  Float?   // e.g. 92.5
  avgPackage        Float?   // in LPA (lakhs per annum)
  highestPackage    Float?   // in LPA
  topRecruiters     String[] // ["Google", "Microsoft", "Amazon"]
  
  // Entrance Exams accepted
  examsAccepted     String[] // ["JEE Main", "JEE Advanced", "GATE"]
  
  // Contact
  website           String?
  phone             String?
  email             String?
  address           String?
  pincode           String?
  
  // Media
  imageUrl          String?
  logoUrl           String?
  
  // Content
  about             String?  // 2-3 paragraph description
  highlights        String[] // ["IIT status", "Research focus", "Global alumni"]
  
  // Streams/Courses offered (simplified — streams, not full course catalog)
  streams           Stream[] // Engineering, Management, Medical, etc.
  
  // Stats
  totalStudents     Int?
  totalFaculty      Int?
  campusArea        Float?  // in acres
  
  // SEO
  metaDescription   String?
  
  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  courses           Course[]
  reviews           Review[]
  savedByUsers      SavedCollege[]

  // Indexes — critical for read-heavy filter queries
  @@index([state])
  @@index([type])
  @@index([nirfRank])
  @@index([minFees])
  @@index([placementPercent])
  @@index([slug])
}

enum CollegeType {
  GOVERNMENT
  PRIVATE
  DEEMED
  CENTRAL
}

enum Stream {
  ENGINEERING
  MANAGEMENT
  MEDICAL
  LAW
  ARTS
  SCIENCE
  COMMERCE
  DESIGN
  PHARMACY
  AGRICULTURE
}

model Course {
  id          String  @id @default(cuid())
  name        String  // "B.Tech Computer Science"
  shortName   String? // "B.Tech CSE"
  duration    Int     // in years — e.g. 4
  degree      String  // "B.Tech", "M.Tech", "MBA", "MBBS"
  stream      Stream
  fees        Int?    // annual fees for this specific course in INR
  seats       Int?
  collegeId   String
  college     College @relation(fields: [collegeId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())

  @@index([collegeId])
  @@index([stream])
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String
  name          String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  savedColleges SavedCollege[]
  reviews       Review[]
}

model SavedCollege {
  id         String   @id @default(cuid())
  userId     String
  collegeId  String
  savedAt    DateTime @default(now())

  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  college    College  @relation(fields: [collegeId], references: [id], onDelete: Cascade)

  @@unique([userId, collegeId])  // prevents duplicate saves
  @@index([userId])
}

model Review {
  id         String   @id @default(cuid())
  userId     String
  collegeId  String
  rating     Float    // 1.0 to 5.0
  title      String?
  body       String?
  pros       String[]
  cons       String[]
  createdAt  DateTime @default(now())

  user       User     @relation(fields: [userId], references: [id])
  college    College  @relation(fields: [collegeId], references: [id], onDelete: Cascade)

  @@index([collegeId])
}
```

**Key schema decisions explained:**
- `slug` is used in all URLs instead of the raw ID. This is better for SEO and is more shareable (e.g. `/college/iit-madras` instead of `/college/clx9abc123`).
- `streams` is a Postgres array enum — avoids a separate junction table for a simple many-to-many that doesn't need extra metadata.
- `examsAccepted` and `topRecruiters` are string arrays — the data doesn't need a full relation table for this project's scope.
- Every field that will be filtered on has a `@@index` — this is what makes filters fast at scale.
- `@@unique([userId, collegeId])` on `SavedCollege` means a user can never accidentally save the same college twice even if they spam the button.

---

## 4. Real Data Strategy

### Why Real Data Matters
A tester will immediately recognize "College 1, City 1, ₹1,00,000" as fake. Real data is non-negotiable.

### Data Sources (All Free)

**Source 1 — NIRF 2024 (Best)**
- URL: https://www.nirfindia.org/2024/EngineeringRanking.html
- Contains: Official NIRF ranks, scores, institution names, city, state for top 200 engineering colleges
- Format: Downloadable PDF / HTML table
- Time to collect: 1 hour (manual copy + script)

**Source 2 — Kaggle Dataset (Fastest)**
- Search: "india college dataset NIRF" on kaggle.com
- Several CSVs exist with 500-1000 colleges
- Fields typically included: name, state, city, type, fees, courses, accreditation
- Time to collect: 30 minutes (download + run seed script)

**Recommended approach:**
1. Download a Kaggle CSV first (30 min) — gets 500+ colleges in DB immediately
2. Cross-reference NIRF 2024 top 100 — add NIRF ranks, scores, and placement data for the top colleges
3. Manually enrich 20-30 famous colleges (IITs, NITs, IIMs) with complete data — these are the ones evaluators will search for

### Seed Script Structure

```typescript
// prisma/seed.ts
import { PrismaClient, CollegeType, Stream } from '@prisma/client';
import * as fs from 'fs';
import * as csv from 'csv-parse/sync';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  
  // Clear existing data
  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  // Load CSV
  const raw = fs.readFileSync('./data/colleges.csv', 'utf-8');
  const rows = csv.parse(raw, { columns: true, skip_empty_lines: true });

  for (const row of rows) {
    // Generate slug from name — e.g. "IIT Madras" → "iit-madras"
    const slug = row.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    await prisma.college.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        name: row.name || 'Unknown',
        city: row.city || 'Unknown',
        state: row.state || 'Unknown',
        type: (row.type as CollegeType) || CollegeType.PRIVATE,
        nirfRank: row.nirf_rank ? parseInt(row.nirf_rank) : null,
        minFees: row.min_fees ? parseInt(row.min_fees) : null,
        maxFees: row.max_fees ? parseInt(row.max_fees) : null,
        placementPercent: row.placement_percent ? parseFloat(row.placement_percent) : null,
        avgPackage: row.avg_package ? parseFloat(row.avg_package) : null,
        naacGrade: row.naac_grade || null,
        streams: row.streams ? row.streams.split(',').map((s: string) => s.trim() as Stream) : [],
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
```

---

## 5. Backend — Complete Architecture

### Folder Structure

```
backend/
├── src/
│   ├── app.ts              # Express app setup (middleware, routes, error handler)
│   ├── index.ts            # Server entry point
│   ├── lib/
│   │   └── prisma.ts       # Prisma singleton
│   ├── middleware/
│   │   ├── auth.ts         # JWT verification middleware
│   │   ├── validate.ts     # Zod validation wrapper
│   │   └── rateLimiter.ts  # express-rate-limit configs
│   ├── routes/
│   │   ├── colleges.ts     # GET /colleges, GET /colleges/:slug
│   │   ├── auth.ts         # POST /auth/signup, POST /auth/login, GET /auth/me
│   │   ├── saved.ts        # GET/POST/DELETE /saved
│   │   ├── compare.ts      # GET /compare?ids=id1,id2,id3
│   │   └── ai.ts           # POST /ai/recommend
│   ├── schemas/
│   │   ├── college.schema.ts   # Zod schemas for college queries
│   │   └── auth.schema.ts      # Zod schemas for auth bodies
│   └── types/
│       └── express.d.ts    # Extend Request type with user field
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── data/
│   └── colleges.csv        # Your seed CSV
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

### app.ts — Complete Setup

```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { collegeRoutes } from './routes/colleges';
import { authRoutes } from './routes/auth';
import { savedRoutes } from './routes/saved';
import { compareRoutes } from './routes/compare';
import { aiRoutes } from './routes/ai';

const app = express();

// Security headers — one line, big impact
app.use(helmet());

// CORS — only allow your Vercel domain in production
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL  // e.g. https://campiq.vercel.app
    : 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/colleges', collegeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/ai', aiRoutes);

// Health check — Render uses this to verify the service is up
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Global error handler — MUST be the last middleware
// Catches any error thrown in any route
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[ERROR]', err);
  
  // Don't leak internal error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong'
    : err.message;

  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message,
    }
  });
});

export default app;
```

### Colleges Route — Production Quality

```typescript
// src/routes/colleges.ts
import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/colleges — Listing with filters, search, pagination
const collegeQuerySchema = z.object({
  search:   z.string().optional(),
  state:    z.string().optional(),
  type:     z.enum(['GOVERNMENT', 'PRIVATE', 'DEEMED', 'CENTRAL']).optional(),
  stream:   z.string().optional(),
  minFees:  z.coerce.number().optional(),
  maxFees:  z.coerce.number().optional(),
  sort:     z.enum(['nirfRank', 'fees', 'placement', 'name']).optional().default('nirfRank'),
  order:    z.enum(['asc', 'desc']).optional().default('asc'),
  page:     z.coerce.number().min(1).optional().default(1),
  limit:    z.coerce.number().min(1).max(50).optional().default(12),
});

router.get('/', async (req, res, next) => {
  try {
    const query = collegeQuerySchema.parse(req.query);
    
    const where: any = {};
    
    // Full-text search on name and city
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
        { shortName: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    
    if (query.state)  where.state = { equals: query.state, mode: 'insensitive' };
    if (query.type)   where.type = query.type;
    if (query.stream) where.streams = { has: query.stream };
    
    if (query.minFees || query.maxFees) {
      where.minFees = {};
      if (query.minFees) where.minFees.gte = query.minFees;
      if (query.maxFees) where.minFees.lte = query.maxFees;
    }

    // Sort mapping
    const orderBy: any = {};
    switch (query.sort) {
      case 'nirfRank':
        // Null ranks go to the end
        orderBy.nirfRank = { sort: query.order, nulls: 'last' };
        break;
      case 'fees':
        orderBy.minFees = { sort: query.order, nulls: 'last' };
        break;
      case 'placement':
        orderBy.placementPercent = { sort: query.order, nulls: 'last' };
        break;
      case 'name':
        orderBy.name = query.order;
        break;
    }

    const skip = (query.page - 1) * query.limit;

    // Run count and data fetch in parallel — faster than sequential
    const [total, colleges] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: query.limit,
        select: {
          id: true, slug: true, name: true, shortName: true,
          city: true, state: true, type: true,
          nirfRank: true, naacGrade: true,
          minFees: true, maxFees: true,
          placementPercent: true, avgPackage: true,
          streams: true, examsAccepted: true,
          imageUrl: true, logoUrl: true,
          highlights: true,
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        colleges,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages: Math.ceil(total / query.limit),
          hasNext: query.page < Math.ceil(total / query.limit),
          hasPrev: query.page > 1,
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/colleges/:slug — Detail page
router.get('/:slug', async (req, res, next) => {
  try {
    const college = await prisma.college.findUnique({
      where: { slug: req.params.slug },
      include: {
        courses: {
          orderBy: { fees: 'asc' }
        },
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { savedByUsers: true } }
      }
    });

    if (!college) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'College not found' }
      });
    }

    res.json({ success: true, data: college });
  } catch (err) {
    next(err);
  }
});

// GET /api/colleges/meta/filters — Returns available filter options
// Cached implicitly by most CDNs — no need for Redis at this scale
router.get('/meta/filters', async (_req, res, next) => {
  try {
    const [states, streams] = await Promise.all([
      prisma.college.findMany({
        distinct: ['state'],
        select: { state: true },
        orderBy: { state: 'asc' }
      }),
      // Streams come from enum, no DB query needed
      Promise.resolve(['ENGINEERING', 'MANAGEMENT', 'MEDICAL', 'LAW', 'ARTS', 'SCIENCE'])
    ]);

    res.json({
      success: true,
      data: {
        states: states.map(s => s.state),
        streams,
        types: ['GOVERNMENT', 'PRIVATE', 'DEEMED', 'CENTRAL'],
        feeRanges: [
          { label: 'Under ₹1L/yr', min: 0, max: 100000 },
          { label: '₹1L – ₹3L/yr', min: 100000, max: 300000 },
          { label: '₹3L – ₹10L/yr', min: 300000, max: 1000000 },
          { label: 'Above ₹10L/yr', min: 1000000, max: null },
        ]
      }
    });
  } catch (err) {
    next(err);
  }
});

export { router as collegeRoutes };
```

### Consistent API Response Shape
Every single endpoint returns this shape — success or failure:

```typescript
// Success
{ success: true, data: { ... } }

// Error  
{ success: false, error: { code: 'SOME_CODE', message: 'Human readable message' } }

// List with pagination
{ success: true, data: { items: [...], pagination: { page, total, totalPages, hasNext, hasPrev } } }
```

This consistency means the frontend can have a single Axios interceptor that handles all error cases without per-route logic.

### Auth Route — Secure by Default

```typescript
// src/routes/auth.ts
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

const signupSchema = z.object({
  name:     z.string().min(2).max(50),
  email:    z.string().email(),
  password: z.string().min(8).max(72), // bcrypt max is 72 chars
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string(),
});

// Apply rate limiting to all auth routes — 5 attempts per 15 minutes per IP
router.use(authRateLimiter);

router.post('/signup', async (req, res, next) => {
  try {
    const body = signupSchema.parse(req.body);
    
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'EMAIL_TAKEN', message: 'An account with this email already exists' }
      });
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({
      data: { name: body.name, email: body.email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({ success: true, data: { user, token } });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    
    // Always compare hash even if user not found — prevents timing attacks
    const passwordMatch = user
      ? await bcrypt.compare(body.password, user.passwordHash)
      : await bcrypt.compare(body.password, '$2b$12$invalidhashpaddingtopreventimagtiming');
    
    if (!user || !passwordMatch) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        token
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'No token provided' }
      });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User no longer exists' }
      });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Token is invalid or expired' }
      });
    }
    next(err);
  }
});

export { router as authRoutes };
```

---

## 6. Groq AI Recommender

### Why Groq
- Genuinely free (no credit card, 14,400 requests/day)
- Fastest inference available — under 1 second responses
- OpenAI-compatible SDK — simple to use
- `response_format: { type: 'json_object' }` enforces valid JSON every time

### Backend Endpoint

```typescript
// src/routes/ai.ts
import { Router } from 'express';
import { z } from 'zod';
import Groq from 'groq-sdk';
import prisma from '../lib/prisma';

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const recommendSchema = z.object({
  stream:   z.enum(['ENGINEERING', 'MANAGEMENT', 'MEDICAL', 'LAW', 'ARTS', 'SCIENCE']),
  budget:   z.number().min(0), // max annual fees in INR
  state:    z.string().optional(), // preferred state, or null for "anywhere"
  priority: z.enum(['placements', 'fees', 'ranking', 'research', 'campus']),
  score:    z.string().optional(), // JEE rank / NEET score / CAT percentile
});

router.post('/recommend', async (req, res, next) => {
  try {
    const prefs = recommendSchema.parse(req.body);

    // Step 1: Pre-filter in Postgres FIRST (keeps Groq context window small)
    const candidates = await prisma.college.findMany({
      where: {
        streams: { has: prefs.stream },
        ...(prefs.budget > 0 ? { minFees: { lte: prefs.budget } } : {}),
        ...(prefs.state ? { state: { contains: prefs.state, mode: 'insensitive' } } : {}),
      },
      orderBy: { nirfRank: { sort: 'asc', nulls: 'last' } },
      take: 20, // max 20 colleges sent to Groq
      select: {
        id: true, name: true, city: true, state: true,
        nirfRank: true, minFees: true, maxFees: true,
        placementPercent: true, avgPackage: true, naacGrade: true,
        streams: true, about: true,
      }
    });

    if (candidates.length === 0) {
      return res.json({
        success: true,
        data: { recommendations: [], message: 'No colleges match your filters. Try widening your criteria.' }
      });
    }

    // Step 2: Send pre-filtered list to Groq
    const prompt = `
You are an expert Indian college admissions advisor. A student is looking for college recommendations.

STUDENT PREFERENCES:
- Stream: ${prefs.stream}
- Max annual budget: ₹${(prefs.budget / 100000).toFixed(1)} Lakhs
- Preferred state: ${prefs.state || 'Anywhere in India'}
- Top priority: ${prefs.priority}
${prefs.score ? `- Entrance score/rank: ${prefs.score}` : ''}

AVAILABLE COLLEGES (pre-filtered to match basic criteria):
${JSON.stringify(candidates, null, 2)}

YOUR TASK:
Pick the best 3-5 colleges from the list above that match this student's preferences.
For each college, provide:
1. Why it's a strong match for THIS specific student (2 sentences, be specific about fees, rank, placements)
2. A matchScore from 0-100 based on how well it matches their preferences

Return ONLY a JSON object in this exact format, nothing else:
{
  "recommendations": [
    {
      "collegeId": "string",
      "collegeName": "string",
      "matchScore": number,
      "reason": "string (2 sentences explaining why this college fits this student specifically)"
    }
  ]
}

Order by matchScore descending. Be specific — mention actual numbers from the data.
`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.2, // Low temperature = consistent, factual output
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate the response has the shape we expect
    if (!result.recommendations || !Array.isArray(result.recommendations)) {
      throw new Error('AI returned unexpected format');
    }

    res.json({ success: true, data: result });
  } catch (err) {
    // If Groq fails, don't crash — return a helpful fallback
    if ((err as any).message?.includes('AI returned')) {
      return res.status(500).json({
        success: false,
        error: { code: 'AI_ERROR', message: 'AI recommendation temporarily unavailable. Try again in a moment.' }
      });
    }
    next(err);
  }
});

export { router as aiRoutes };
```

---

## 7. Frontend — Full Overhaul Plan

### Folder Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout (fonts, theme, providers)
│   ├── page.tsx                # Homepage — SSR
│   ├── explore/
│   │   └── page.tsx            # College listing — SSR with client filter hydration
│   ├── college/
│   │   └── [slug]/
│   │       └── page.tsx        # College detail — SSR + dynamic metadata
│   ├── compare/
│   │   └── page.tsx            # Compare tool — client component
│   ├── saved/
│   │   └── page.tsx            # Saved colleges — protected, client
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── sitemap.ts              # Auto-generated sitemap
│   └── robots.ts               # robots.txt
├── components/
│   ├── ui/                     # Pure presentational components
│   │   ├── CollegeCard.tsx
│   │   ├── CollegeCardSkeleton.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── FilterDrawer.tsx    # Mobile version
│   │   ├── CompareTable.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Pagination.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   └── Badge.tsx
│   ├── features/               # Feature-specific components
│   │   ├── AIRecommender/
│   │   │   ├── AIModal.tsx
│   │   │   ├── PreferenceForm.tsx
│   │   │   └── RecommendationCard.tsx
│   │   ├── Compare/
│   │   │   ├── CompareBar.tsx  # Floating bar showing selected colleges
│   │   │   └── CompareTable.tsx
│   │   └── College/
│   │       ├── CollegeDetailTabs.tsx
│   │       ├── CoursesTab.tsx
│   │       └── PlacementsTab.tsx
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── hooks/
│   ├── useColleges.ts          # TanStack Query hook for college listing
│   ├── useCollege.ts           # Single college detail
│   ├── useSaved.ts             # Saved colleges with optimistic updates
│   ├── useCompare.ts           # Compare state + localStorage persistence
│   ├── useFilters.ts           # URL-synced filter state
│   └── useAuth.ts              # Auth state + token management
├── lib/
│   ├── api.ts                  # Axios instance with interceptors
│   └── utils.ts                # formatFees, formatPackage, slugToTitle, etc.
├── store/
│   └── compareStore.ts         # Zustand store for compare selections
└── types/
    └── index.ts                # Shared TypeScript types
```

### Critical Hook: URL-Synced Filters

```typescript
// hooks/useFilters.ts
'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export type Filters = {
  search?: string;
  state?: string;
  type?: string;
  stream?: string;
  minFees?: number;
  maxFees?: number;
  sort?: string;
  page?: number;
};

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: Filters = {
    search:   searchParams.get('search') || undefined,
    state:    searchParams.get('state') || undefined,
    type:     searchParams.get('type') || undefined,
    stream:   searchParams.get('stream') || undefined,
    minFees:  searchParams.get('minFees') ? Number(searchParams.get('minFees')) : undefined,
    maxFees:  searchParams.get('maxFees') ? Number(searchParams.get('maxFees')) : undefined,
    sort:     searchParams.get('sort') || 'nirfRank',
    page:     searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  };

  const setFilter = useCallback((key: keyof Filters, value: string | number | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === undefined || value === '') {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    
    // Reset to page 1 whenever a filter changes (except page itself)
    if (key !== 'page') params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const activeFilterCount = Object.entries(filters)
    .filter(([key, val]) => val !== undefined && key !== 'sort' && key !== 'page')
    .length;

  return { filters, setFilter, resetFilters, activeFilterCount };
}
```

### Axios Setup with Interceptors

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('campiq_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear auth and redirect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('campiq_token');
        localStorage.removeItem('campiq_user');
        window.dispatchEvent(new Event('auth:logout'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Compare Store with localStorage Persistence

```typescript
// store/compareStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CollegeSummary {
  id: string;
  slug: string;
  name: string;
  city: string;
  nirfRank?: number;
  minFees?: number;
  placementPercent?: number;
  imageUrl?: string;
}

interface CompareStore {
  selected: CollegeSummary[];
  add: (college: CollegeSummary) => void;
  remove: (id: string) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
  canAdd: () => boolean; // max 3
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      selected: [],
      
      add: (college) => {
        if (get().selected.length >= 3) return; // Hard cap at 3
        if (get().isSelected(college.id)) return; // Already in list
        set((state) => ({ selected: [...state.selected, college] }));
      },
      
      remove: (id) => set((state) => ({
        selected: state.selected.filter(c => c.id !== id)
      })),
      
      clear: () => set({ selected: [] }),
      
      isSelected: (id) => get().selected.some(c => c.id === id),
      
      canAdd: () => get().selected.length < 3,
    }),
    {
      name: 'campiq-compare', // localStorage key
    }
  )
);
```

### Compare Table with Winner Highlighting

```typescript
// components/features/Compare/CompareTable.tsx
'use client';

const ROWS = [
  { key: 'nirfRank',          label: 'NIRF Rank',         format: (v: any) => v ? `#${v}` : 'N/A',         winner: 'min' },
  { key: 'minFees',           label: 'Annual Fees',        format: (v: any) => v ? `₹${(v/100000).toFixed(1)}L` : 'N/A',  winner: 'min' },
  { key: 'placementPercent',  label: 'Placement %',        format: (v: any) => v ? `${v}%` : 'N/A',         winner: 'max' },
  { key: 'avgPackage',        label: 'Avg Package',        format: (v: any) => v ? `₹${v}L` : 'N/A',        winner: 'max' },
  { key: 'naacGrade',         label: 'NAAC Grade',         format: (v: any) => v || 'N/A',                   winner: null  },
  { key: 'state',             label: 'Location',           format: (v: any) => v || 'N/A',                   winner: null  },
  { key: 'type',              label: 'Type',               format: (v: any) => v || 'N/A',                   winner: null  },
];

function getWinner(colleges: any[], key: string, direction: 'min' | 'max'): string | null {
  const values = colleges.map(c => ({ id: c.id, val: c[key] })).filter(x => x.val !== null && x.val !== undefined);
  if (values.length < 2) return null;
  
  const winner = direction === 'min'
    ? values.reduce((a, b) => a.val < b.val ? a : b)
    : values.reduce((a, b) => a.val > b.val ? a : b);
  
  return winner.id;
}

export function CompareTable({ colleges }: { colleges: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-4 text-sm text-gray-400 font-medium w-40">Metric</th>
            {colleges.map(college => (
              <th key={college.id} className="p-4 text-center min-w-48">
                <CollegeHeader college={college} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map(row => {
            const winnerId = row.winner ? getWinner(colleges, row.key, row.winner as 'min' | 'max') : null;
            
            return (
              <tr key={row.key} className="border-t border-white/5">
                <td className="p-4 text-sm text-gray-400 font-medium">{row.label}</td>
                {colleges.map(college => {
                  const isWinner = winnerId === college.id;
                  return (
                    <td
                      key={college.id}
                      className={`p-4 text-center text-sm transition-colors ${
                        isWinner
                          ? 'bg-teal-500/10 text-teal-400 font-semibold' // Winner highlighted
                          : 'text-gray-300'
                      }`}
                    >
                      {row.format(college[row.key])}
                      {isWinner && (
                        <span className="ml-1 text-xs text-teal-500">★ Best</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 8. Stitch UI Prompt (Google Antigravity MCP)

> Paste this exact prompt into Google's Stitch via the Antigravity MCP. It is structured to first understand the existing screens, then redesign them from scratch with award-winning standards.

---

```
STITCH REDESIGN PROMPT — CAMPIQ COLLEGE DISCOVERY PLATFORM

PHASE 1: UNDERSTAND THE CURRENT STATE
Before designing anything, review the existing screens I will describe below. Understand what each screen is trying to do, what information it surfaces, and where it fails the user.

CURRENT SCREENS:

1. HOMEPAGE
- Has a hero section with a search bar and tagline
- Features section with 3-4 cards describing platform features
- Simple navigation bar with logo and auth links

Problems with current: feels generic, doesn't immediately communicate what Campiq does differently from Collegedunia, no emotional hook, animations are minimal

2. EXPLORE / COLLEGE LISTING PAGE
- Grid of college cards (12 per page)
- Left sidebar with filters: state, college type, stream, fees range, sort
- Search bar at the top
- Pagination at the bottom

Problems with current: filter sidebar feels like a form from 2018, college cards are too data-dense with no visual breathing room, the "sort" control is awkward, mobile layout collapses poorly

3. COLLEGE DETAIL PAGE
- Header with college name, city, type badge, NIRF rank
- Tabs: Overview / Courses / Placements / Reviews
- Stats section (fees, placement %, avg package)

Problems with current: information hierarchy is unclear — all stats have equal visual weight, the tab navigation is basic, the hero lacks visual interest, recruiter logos are just text

4. COMPARE PAGE
- Side-by-side table with rows for each metric
- College header at top of each column
- Remove button per column

Problems with current: the table is visually flat, winner cells are not highlighted, the empty state (no colleges selected) is unhelpful, mobile is unusable

5. AUTH PAGES (Login / Signup)
- Standard form with email/password fields
- Submit button
- Link to the other auth page

Problems with current: visually boring, no brand personality, password strength indicator missing

6. SAVED COLLEGES PAGE
- Grid of saved college cards
- Remove from saved button on each card

Problems with current: identical to explore grid, no differentiation, empty state is bare

7. AI RECOMMENDER MODAL
- Triggered by "Find My College" button
- Multi-step form: stream → budget → state → priority
- Results shown as cards

Problems with current: not yet built — design from scratch

---

PHASE 2: THE REDESIGN BRIEF

BRAND IDENTITY:
- Name: Campiq (campus + IQ — smart college decisions)
- Tagline: "Your smartest path to the right college"
- Personality: Precise, trustworthy, modern — like a brilliant friend who went to IIT and will give you honest advice
- NOT corporate, NOT educational-platform-generic, NOT startup-flashy

COLOR SYSTEM (DARK MODE ONLY — NON-NEGOTIABLE):

Base palette (NOT plain black):
- Deep background:  #0C1117  (very deep forest-slate, not pure black)
- Card surface:     #111820  (slightly lighter, blue-black)
- Elevated surface: #161F2C  (for modals, dropdowns)
- Border subtle:    rgba(255,255,255,0.06)
- Border stronger:  rgba(255,255,255,0.12)

Accent palette (ALL three must appear on every major screen):
- Bio Teal:         #00D4A0  (primary — CTAs, links, active states, highlights)
- Solar Amber:      #F5A623  (secondary — ratings, stars, packages, "best" badges)
- Nebula Violet:    #9B7BFF  (tertiary — tags, stream badges, AI-related UI)

Text:
- Primary:    #F0F4F8
- Secondary:  #8B9CB0
- Muted:      #4A5568

TYPOGRAPHY:
- Headings: Inter (weight 700-800), tight letter-spacing
- Body: Inter (weight 400-500)
- Mono/data: JetBrains Mono for numbers like NIRF rank, fees, LPA

ANIMATION PHILOSOPHY — PREMIUM, NOT FLASHY:
Every animation should feel like it belongs to a ₹50,000/month SaaS tool.
Rules:
- Cards fade-in + slide up 8px on mount (staggered, 40ms between each)
- Hover on cards: subtle border glow (teal, 0.3 opacity) + 2px translate-Y
- Winner cells in compare table: pulse animation on mount (scale 1→1.02→1)
- AI modal: frosted glass overlay with backdrop-blur, slides up from bottom on mobile
- Filter chips: spring animation when added/removed
- Page transitions: fade (200ms), no slide — this is a data app, not a photo gallery
- Loading skeletons: shimmer effect using the card background colors
- Numbers (fees, rank, package): count-up animation when they enter viewport
- Toast notifications: slide in from top-right, auto-dismiss with progress bar
- NO: parallax, excessive 3D transforms, bounce physics on functional elements

DESIGN RULES (MUST FOLLOW):

1. INFORMATION HIERARCHY — DECISION-FIRST
   On every college card, these 3 metrics are the LARGEST elements:
   - NIRF Rank (if available) — top-left, displayed as "#12" in large teal text
   - Fees — formatted as "₹1.2L/yr"
   - Placement % — formatted as "92%"
   These drive 80% of student decisions. Everything else (location, type, NAAC) is secondary.

2. COLLEGE CARDS — PREMIUM STRUCTURE
   Each card should have:
   - Top gradient bar (3px): teal on left → violet on right (this is the brand signature)
   - College logo (or initials fallback with gradient avatar) — top left
   - College name (large, bold) + city (small, muted)
   - Type badge (GOVT / PRIVATE / DEEMED) + stream tags (ENGINEERING, etc.)
   - The 3 primary metrics in a row: Rank | Fees | Placement
   - Bottom row: "Compare" button (ghost) + "Save" (heart icon, toggle)
   - Hover state: subtle teal border glow

3. FILTER SIDEBAR (DESKTOP) — MODERN, NOT A FORM
   - Slim sidebar (240px), not a wide panel
   - Each filter section has a subtle header with count badge when active
   - Pill/chip style for multi-select options (stream, type) — not checkboxes
   - Range slider for fees — not a dropdown
   - Active filters shown as removable chips at the top of the results area
   - "Clear all" only appears when filters are active
   - Smooth collapse/expand per section

4. FILTER DRAWER (MOBILE) — BOTTOM SHEET
   - Full-width bottom sheet, slides up from bottom
   - Frosted glass header with "Filters" title + active count + Close button
   - Same pill chips, range slider
   - Sticky "Show X colleges" button at bottom

5. COLLEGE DETAIL PAGE — STRUCTURED NARRATIVE
   - Full-width hero: college name, NIRF rank chip (large), city + state, type badge
   - Instant-read stats bar (always visible, even when scrolling): Fees | Placement % | Avg Package | NAAC Grade
   - Sticky tab nav below hero
   - Overview tab: About (2-3 paragraphs), Highlights (icon + text chips), Exams accepted (pill badges)
   - Courses tab: Table with degree | duration | fees per year — sortable
   - Placements tab: The 3 big numbers (placement %, avg package, highest package) in large display, then recruiter grid with logo/name chips
   - The stats bar MUST stay sticky on scroll — this is the key UX decision that separates Campiq from Collegedunia

6. COMPARE PAGE — MAKE THE WINNER OBVIOUS
   - College header cards (with mini stats) across the top
   - Row-by-row comparison table
   - NIRF rank row: college with best rank gets a teal background + "★ Best Rank" chip
   - Fees row: lowest fees gets teal + "★ Lowest Fees" chip
   - Placement row: highest placement gets teal + "★ Best Placement" chip
   - Non-winner cells: standard dark background
   - The visual difference must be immediately obvious — like how stock apps highlight gains in green
   - Share button: copies URL (?ids=...) to clipboard, shows toast confirmation
   - Empty state: illustration + "Add colleges from Explore to compare" + CTA button

7. AI RECOMMENDER MODAL
   - Triggered by "Find My College" button (prominent, Nebula Violet)
   - Frosted glass modal with backdrop-blur
   - 4-step form (no next button needed — selecting an option auto-advances):
     Step 1: "Which stream?" — 6 large icon cards (Engineering, Management, Medical, Law, Arts, Science)
     Step 2: "What's your budget?" — 4 fee range cards
     Step 3: "Where would you like to study?" — state selector or "Anywhere"
     Step 4: "What matters most?" — 5 priority cards (Placements, Ranking, Fees, Research, Campus Life)
   - Progress bar at top (4 steps)
   - Loading state: animated Campiq logo + "Campiq AI is thinking..." (no spinner — feels cheap)
   - Results: 3-5 recommendation cards with college name, match score (displayed as %) and AI reason (1-2 sentences in italic)
   - Each result card has "View College" CTA

8. AUTH PAGES — BRANDED, NOT GENERIC
   - Split layout: left side = Campiq brand panel (dark, with feature highlights), right side = form
   - Mobile: just the form, clean
   - Password field: show/hide toggle + strength indicator (4 colored segments that fill as you type)
   - Error messages: inline, below the field, in amber color — never a red banner at top

9. HOMEPAGE — THE HOOK
   - Hero: "Find your ideal college — fast." in large display type
   - Sub-headline: "Campiq cuts through the noise. Compare colleges on what actually matters: rank, fees, and placements."
   - Primary CTA: "Explore Colleges" (large, teal)
   - Secondary CTA: "Find My College" (ghost, violet — triggers AI modal)
   - Below hero: 3 stat counters (animate count-up on load): "200+ colleges", "6 streams", "Real NIRF 2024 data"
   - Feature section: 3 cards with the 3 differentiators:
     Card 1: "Compare that shows a winner" — Campiq highlights the best option in each category. No more squinting at tables.
     Card 2: "Decision-first layout" — The three numbers that drive 90% of decisions — rank, fees, placement — front and center on every screen.
     Card 3: "AI recommendations" — Tell Campiq your preferences. Get 3 specific colleges with a clear reason why.

RESPONSIVE BREAKPOINTS:
- Mobile: 375px — single column, bottom-sheet filters, hamburger nav
- Tablet: 768px — 2-column card grid, collapsed sidebar
- Desktop: 1280px+ — 3-column card grid, full sidebar

WHAT TO PRODUCE:
Design all 7 screens described above (Homepage, Explore, College Detail, Compare, Login, Signup, Saved, AI Modal as overlay on Explore) with:
- Dark mode only using the exact color tokens above
- All animations annotated
- Mobile + desktop variants for Explore and Compare
- Hover/active states on all interactive elements
- Empty states for Explore (no results) and Compare (no colleges selected) and Saved (no saved colleges)
- Loading skeleton versions of the College Card and College Detail hero

The goal: when an evaluator opens this product, they should think "this looks better than Collegedunia" within 3 seconds. The UI must feel like a product a YC company would ship, not a student assignment.
```

---

## 9. SEO Strategy

### Dynamic Metadata (Next.js App Router)

```typescript
// app/college/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/colleges/${params.slug}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  
  if (!res.ok) return { title: 'College Not Found | Campiq' };
  
  const { data: college } = await res.json();
  
  const feesStr = college.minFees ? `₹${(college.minFees/100000).toFixed(1)}L/yr fees` : '';
  const placementStr = college.placementPercent ? `${college.placementPercent}% placement` : '';
  const rankStr = college.nirfRank ? `NIRF Rank #${college.nirfRank}` : '';
  
  return {
    title: `${college.name} — ${rankStr} | Campiq`,
    description: `${college.name} in ${college.city}, ${college.state}. ${[rankStr, feesStr, placementStr].filter(Boolean).join(' · ')}. Explore courses, compare colleges, and make your decision on Campiq.`,
    openGraph: {
      title: college.name,
      description: `${[rankStr, feesStr, placementStr].filter(Boolean).join(' · ')}`,
      url: `https://campiq.vercel.app/college/${college.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: college.name,
      description: `${[rankStr, feesStr, placementStr].filter(Boolean).join(' · ')}`,
    }
  };
}
```

### Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/colleges?limit=500&page=1`);
  const { data } = await res.json();
  const colleges = data.colleges || [];

  const collegeUrls = colleges.map((c: any) => ({
    url: `https://campiq.vercel.app/college/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    { url: 'https://campiq.vercel.app', lastModified: new Date(), priority: 1.0 },
    { url: 'https://campiq.vercel.app/explore', lastModified: new Date(), priority: 0.9 },
    { url: 'https://campiq.vercel.app/compare', lastModified: new Date(), priority: 0.7 },
    ...collegeUrls,
  ];
}
```

### robots.ts

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://campiq.vercel.app/sitemap.xml',
  };
}
```

---

## 10. Feature Deep Dives

### Feature 1: College Listing + Search + Filters

**The 5 things that make this production-grade:**

1. **URL-synced filters** — every filter is a query param. Refresh → filters persist. Share link → filters persist. This is what Collegedunia does and what most junior devs skip.

2. **Debounced search with AbortController** — user types "IIT Madras", fires 9 API calls without this. With it, fires 1.
```typescript
const [searchInput, setSearchInput] = useState(filters.search || '');
const abortRef = useRef<AbortController>();

useEffect(() => {
  const timer = setTimeout(() => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setFilter('search', searchInput || undefined);
  }, 300);
  return () => clearTimeout(timer);
}, [searchInput]);
```

3. **Active filter chips** — shown above results. Each chip has an × to remove that single filter. Evaluators will test this.

4. **Empty state** — when filters return 0 results, show a helpful "No colleges match your filters" message with a "Clear all filters" button — not a blank white screen.

5. **Count + pagination** — "Showing 1–12 of 247 colleges" text. Pagination shows correct total. Clicking page 2 doesn't reset filters.

### Feature 2: College Detail Page

**5 things that elevate this:**

1. **SSR (Server-Side Rendering)** — the page HTML arrives pre-filled with data, not blank. Faster for users, better for SEO.

2. **Sticky stats bar** — fees, placement %, avg package, NAAC grade always visible even while scrolling through tabs. This is the #1 UX insight from the competitive research — Collegedunia buries these stats in different tabs.

3. **Dynamic OG metadata** — each college page has its own social preview card (NIRF rank, fees, placement in the description).

4. **Skeleton that matches layout** — while data loads, show placeholder shapes that match the exact card/tab structure. Not a spinning loader.

5. **404 handling** — if someone navigates to `/college/fake-slug`, show a proper "College not found" page with a link back to explore.

### Feature 3: Compare Tool (HIGH PRIORITY)

**The 5 things that make this best in class:**

1. **Winner highlighting** — the unique differentiator. Best NIRF rank, lowest fees, highest placement % are highlighted in teal. No competitor does this.

2. **Persistent selections** — Zustand `persist` middleware stores compare selections in localStorage. Refresh → selections survive. This is the test evaluators use to check if you "actually saved state."

3. **Shareable URL** — `/compare?ids=id1,id2,id3`. When all 3 colleges are selected, a "Share" button copies this URL to clipboard. Evaluators can test this directly.

4. **Hard cap (enforced on both ends)** — frontend disables "Add to Compare" when 3 are selected (visual + disabled state). Backend `/api/compare?ids=...` rejects requests with more than 3 IDs.

5. **Empty state with CTA** — if someone lands on `/compare` with no selections, they see an illustration + "Add colleges from Explore to compare them" + button that links to `/explore`.

### Feature 4: Auth + Saved Colleges

**The 5 things that make this solid:**

1. **JWT stored in localStorage + auto-restoration** — on app mount, read token → call `/auth/me` → if 401, clear and treat as logged out. Silently restores session.

2. **Redirect-after-login** — if user hits `/saved` without auth, redirect to `/auth/login?redirect=/saved`. After login, redirect to `/saved`. Most juniors skip the redirect param.

3. **Optimistic UI on save** — heart icon fills immediately without waiting for the API response. If API fails, revert and show toast. This makes the app feel instant.

4. **Deduplication at the DB level** — `@@unique([userId, collegeId])` in Prisma schema means even if user spam-clicks the save button 10 times, only 1 row exists.

5. **Logout clears everything** — `localStorage.removeItem` for both token and user. No stale state.

---

## 11. Engineering Quality Checklist

Before deploying, verify every item:

### Backend
- [ ] Every route has try/catch with `next(err)`
- [ ] Global error handler is the last middleware in app.ts
- [ ] Zod validation on every POST/PUT body and every GET query
- [ ] Rate limiting on auth routes (5 req/15min/IP)
- [ ] Helmet.js applied
- [ ] CORS locked to frontend domain in production
- [ ] JWT secret is in environment variable, never hardcoded
- [ ] Prisma singleton (one instance, not per-request)
- [ ] All DB queries use `select` to avoid over-fetching sensitive fields (passwordHash never returned)
- [ ] `/health` endpoint returns 200
- [ ] process.on('unhandledRejection') and process.on('uncaughtException') handlers in index.ts
- [ ] Consistent response shape on all endpoints

### Frontend
- [ ] Every data fetch handles: loading state, success state, error state
- [ ] Every form validates before hitting API (React Hook Form + Zod)
- [ ] Axios interceptor handles 401 globally (auto-logout)
- [ ] Compare selections persist on refresh (Zustand persist)
- [ ] URL-synced filters (every filter is a query param)
- [ ] Debounced search (300ms)
- [ ] Empty states on: explore (no results), compare (no selections), saved (no saved colleges)
- [ ] 404 page for `/college/invalid-slug`
- [ ] Mobile responsive at 375px (every page)
- [ ] Loading skeletons match actual layout
- [ ] Toast notifications for: save/unsave, compare add/remove, copy URL, auth errors

### Data
- [ ] 200+ real colleges with real NIRF data
- [ ] No `null` displayed as "null" — all null fields have fallback display logic
- [ ] Slugs are URL-safe (no spaces, no special chars)
- [ ] At least the top 20 famous colleges have complete data (IITs, NITs, IIMs)

---

## 12. GitHub Commit Strategy

Clean commit history signals professionalism. Evaluators check this.

### Conventional Commits Format
```
<type>: <description>

Types: feat, fix, refactor, docs, chore, style, test
```

### Ideal Commit Story (in order)
```
chore: init project structure — next.js frontend + express backend
chore: prisma schema — college, course, user, saved, review models
feat: seed script with 200+ real NIRF 2024 colleges
feat: GET /colleges with search, filters, pagination, sorting
feat: GET /colleges/:slug — detail with courses and reviews
feat: POST/GET /auth — signup, login, /me with JWT + bcrypt
feat: GET/POST/DELETE /saved — save colleges with auth middleware
feat: GET /compare — bulk college fetch for compare feature
feat: POST /ai/recommend — groq llama recommender endpoint
feat: homepage — hero, features, stat counters
feat: explore page — college grid with URL-synced filters + search
feat: college detail page — SSR + sticky stats bar + tabs
feat: compare page — winner-highlighting table + shareable URL
feat: auth pages — login + signup with strength indicator
feat: saved page — saved colleges grid with empty state
feat: ai recommender modal — 4-step form + groq integration
feat: SEO — dynamic metadata, sitemap.ts, robots.ts
fix: handle null NIRF rank in compare winner logic
fix: mobile layout — filter drawer + responsive breakpoints
chore: deploy — vercel frontend + render backend + neon db
docs: technical-notes.md — architecture decisions and tradeoffs
```

---

## 13. Deployment Guide (All Free)

### Database — Neon (Free, Serverless Postgres)
1. Go to neon.tech → Create account → New project → Select region closest to your backend (Singapore for India)
2. Copy the connection string → Add to `DATABASE_URL` in `.env`
3. Run `npx prisma migrate deploy` → `npx prisma db seed`
4. Done. Neon auto-suspends after inactivity and wakes on first query.

**Why Neon over Supabase for this:** Neon's free tier has no row limits and connects directly via Prisma with no extra config. Supabase is great but slightly more setup.

### Backend — Render (Free)
1. Push backend to GitHub
2. render.com → New Web Service → Connect GitHub repo → Select backend folder
3. Settings:
   - Environment: Node
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `GROQ_API_KEY`, `FRONTEND_URL`, `NODE_ENV=production`
4. Deploy. First deploy takes ~3 minutes. Subsequent deploys are automatic on push.

**Important:** Render free tier spins down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds. To mitigate for the demo:
- Add a `/health` endpoint (already done above)
- Optionally set up a free UptimeRobot ping every 10 minutes to keep it warm

### Frontend — Vercel (Free)
1. Push frontend to GitHub
2. vercel.com → New Project → Import from GitHub → Select frontend folder
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL (e.g. `https://campiq-api.onrender.com/api`)
4. Deploy. Done. Auto-deploys on every push to main.

### Environment Variables Summary

**Backend (.env)**
```
DATABASE_URL=postgresql://...@neon.tech/campiq?sslmode=require
JWT_SECRET=a-very-long-random-string-at-least-32-chars
GROQ_API_KEY=gsk_...
FRONTEND_URL=https://campiq.vercel.app
NODE_ENV=production
PORT=10000
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=https://campiq-api.onrender.com/api
```

---

## 14. Technical Notes Document Template

> This is your third deliverable. Write this after the product is built. It should be 1-2 pages, concise, and read like an engineer explaining decisions to another engineer — not a student explaining their project.

---

```markdown
# Campiq — Technical Notes
**Live URL:** https://campiq.vercel.app  
**GitHub:** https://github.com/vishalg/campiq  
**Stack:** Next.js 14 · Express + TypeScript · PostgreSQL (Neon) · Prisma

---

## Architecture Decisions

### Why Next.js App Router with SSR
College detail pages are SSR (server-side rendered) — HTML arrives pre-populated with data. This gives two benefits: faster Time-to-First-Contentful-Paint for users on slow connections, and fully indexable pages for search engines. The explore page uses a hybrid approach — initial data fetched server-side, subsequent filter changes handled client-side via TanStack Query to avoid full page reloads.

### Why URL-Synced Filters
Every filter (state, type, stream, fees range, search, sort, page) is stored as a URL query parameter using Next.js `useSearchParams` + `useRouter`. This means: filters survive a page refresh, are shareable via link, and preserve context when the user navigates back from a detail page. Evaluating this after researching Collegedunia's behavior — their filters reset on refresh, which is a notable UX regression.

### Why Zustand with Persist for Compare
Compare selections need to survive navigation between pages and page refreshes. Zustand's `persist` middleware serializes the compare list to localStorage. I cap selections at 3 and enforce this on both the frontend (disable button) and the backend (reject requests with >3 IDs) — never relying on only one layer.

### Why Pre-filter in Postgres Before Sending to Groq
The Groq free tier has an ~8,000 token context window. Sending all 200+ colleges would exceed this. Instead, the backend applies stream + budget + state filters in Postgres first (indexed columns, fast) and sends the top 20 candidates to Groq. Groq then ranks and reasons across those 20. This means the AI's output is grounded in real data — it can't hallucinate colleges that aren't in the database.

### Why the Consistent API Response Shape
Every endpoint returns `{ success: true, data: {...} }` or `{ success: false, error: { code, message } }`. This allows a single Axios interceptor to handle all error cases — no per-route error parsing, no "if (err.response.data.message)" scattered throughout the frontend.

---

## Tradeoffs

| Decision | What I Chose | What I Traded Off |
|----------|-------------|-------------------|
| Full-text search | Postgres ILIKE queries | Elasticsearch/Typesense at scale |
| Auth | JWT in localStorage | HTTP-only cookies (more XSS-safe) |
| State | Zustand + TanStack Query | Redux (heavier, more boilerplate) |
| AI | Groq (Llama 3.3 70B) | OpenAI GPT-4o (better reasoning, costs money) |
| Data | NIRF 2024 + Kaggle CSV (200 colleges) | Full scrape of 30,000+ colleges |

---

## Scalability Path

**Search at scale:** Current Postgres ILIKE queries work well for 200-500 colleges. Beyond 5,000 colleges, I'd migrate search to Typesense (simpler to self-host than Elasticsearch, open-source). Typesense supports typo-tolerant full-text search and faceted filters natively.

**Read caching:** The explore page data (especially popular filter combinations) could be cached in Redis for 5-minute TTLs. Eliminates most DB load for repeat queries.

**AI recommender:** The Groq endpoint already pre-filters to 20 colleges. If the college count grows to 50,000+, I'd add a vector similarity search step — generate embeddings for each college's profile, query by student preference vector — before the Groq reranking step.

---

## What I Optimized For
Decision speed — the three numbers that drive 90% of college decisions (NIRF rank, fees, placement %) are the largest elements on every card and always visible on the detail page. Resilience — the app handles missing data, network failures, edge cases, and never shows a blank screen. Evaluator experience — URL-synced state means any flow can be reproduced from a link.
```

---

## 15. Day-by-Day Build Plan

### Day 1 — Data + Backend (8-10 hours)

| Time | Task |
|------|------|
| 0:00 – 0:30 | Download Kaggle India colleges CSV |
| 0:30 – 1:00 | Update Prisma schema (copy from this doc) → migrate |
| 1:00 – 2:30 | Write seed script → parse CSV → seed 200+ colleges |
| 2:30 – 3:00 | Manually enrich top 20 IITs/NITs/IIMs with complete data |
| 3:00 – 4:30 | Overhaul colleges route — filters, sorting, pagination, `nulls: 'last'` |
| 4:30 – 5:30 | Auth route — signup with timing-attack protection, login, /me |
| 5:30 – 6:30 | Saved route — optimistic-safe endpoints |
| 6:30 – 7:30 | Compare route — bulk fetch, 3-college cap |
| 7:30 – 8:30 | Groq AI endpoint — copy from this doc, test with Postman |
| 8:30 – 9:00 | Global error handler, Helmet, CORS, rate limiter |
| 9:00 – 9:30 | app.ts, index.ts, Prisma singleton |
| 9:30 – 10:00 | Deploy to Render, test all endpoints live |

### Day 2 — Frontend Overhaul (8-10 hours)

| Time | Task |
|------|------|
| 0:00 – 0:30 | Run Stitch prompt → get UI designs → implement design tokens in Tailwind config |
| 0:30 – 1:30 | Navbar + layout components |
| 1:30 – 2:30 | Homepage — hero, stat counters, feature cards |
| 2:30 – 4:30 | Explore page — URL-synced filters, debounced search, card grid, pagination |
| 4:30 – 5:00 | Filter sidebar (desktop) + filter drawer (mobile) |
| 5:00 – 6:00 | College Card component — all states (loading skeleton, default, hover) |
| 6:00 – 7:30 | College Detail page — SSR, sticky stats bar, tabs, courses, placements |
| 7:30 – 8:30 | Compare page — winner-highlighting table, shareable URL, empty state |
| 8:30 – 9:30 | Auth pages — login/signup, password strength, redirect-after-login |
| 9:30 – 10:00 | Saved page — grid, empty state, optimistic remove |

### Day 3 — Polish + AI + Deploy (6-8 hours)

| Time | Task |
|------|------|
| 0:00 – 2:00 | AI Recommender modal — 4-step form, Groq integration, result cards |
| 2:00 – 3:00 | Mobile pass — every page at 375px, fix any overflow/layout issues |
| 3:00 – 3:30 | SEO — sitemap.ts, robots.ts, generateMetadata on explore + detail |
| 3:30 – 4:00 | Framer Motion animations — card stagger, hover glow, count-up numbers |
| 4:00 – 4:30 | Toast notification system |
| 4:30 – 5:00 | Final smoke test — all 6 user flows, all edge cases |
| 5:00 – 5:30 | Write Technical Notes document |
| 5:30 – 6:00 | Clean GitHub commit history (interactive rebase if needed) |
| 6:00 – 6:30 | Deploy frontend to Vercel + verify live URL |
| 6:30 – 7:00 | Record Loom walkthrough (optional but impressive) |
| 7:00 – 7:30 | Submit via Google Form with all links |

---

## 📤 Final Submission Checklist

- [ ] Live Vercel URL — works, no broken pages
- [ ] GitHub repo — public, clean commits, meaningful messages
- [ ] Part 1 Research Doc — Google Doc / Notion link
- [ ] Technical Notes doc — architecture, tradeoffs, what you optimized for
- [ ] All 4 core features work end-to-end (listing, detail, compare, auth + saved)
- [ ] AI recommender works
- [ ] Mobile responsive
- [ ] Real NIRF data (not placeholder)
- [ ] No hardcoded UI data — everything from the API
- [ ] Google Form submission before deadline

---

*Built for the Campiq Full Stack Developer Internship Trial — May 2026*
