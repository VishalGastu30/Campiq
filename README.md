<div align="center">
  <img src="https://via.placeholder.com/150x150/00D4A0/0C1117?text=C" alt="Campiq Logo" width="100" height="100">
  <h1 align="center">Campiq</h1>
  <p align="center">
    <strong>Find your campus. Own your future.</strong>
    <br />
    A production-grade college discovery and decision platform for Indian students.
  </p>
  <p align="center">
    <a href="https://campiq.vercel.app"><strong>View Live Demo »</strong></a>
    ·
    <a href="https://campiq-api.onrender.com/api/health"><strong>View API Status »</strong></a>
  </p>
</div>

---

## 🌟 Overview

Campiq is a full-stack platform designed to help Indian students search, compare, and shortlist top colleges based on fees, placements, ratings, and courses. It features a premium, dark-mode-first aesthetic with fluid animations, robust filtering capabilities, and an AI-powered counselor for personalized recommendations.

Built as a submission for the **Full Stack Developer Internship Demo Task — Track B: College Discovery Platform**.

## ✨ Features

- **🔍 Advanced Search & Filtering**: Robust case-insensitive search with debouncing. Filter by State, College Type, Annual Fees, and Course Category.
- **📊 Compare Module**: Side-by-side comparison of up to 3 colleges with best-value highlights. Features cross-tab synchronization and shareable URLs.
- **🤖 AI Counselor**: Integrated with Groq (LLaMA 3.3 70B) to provide personalized college recommendations based on stream, budget, and priority.
- **🔐 Secure Authentication**: JWT-based authentication with bcrypt hashing. Protected routes for managing saved college shortlists.
- **📱 Premium UX/UI**: Responsive mobile-first design, dark ocean theme, smooth page transitions, stagger animations, and skeleton loaders.
- **🛡️ Production Ready**: Hardened backend with Helmet, express-rate-limit, Zod validation, and optimized Postgres queries.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS v3
- **Animations:** Framer Motion
- **State Management:** React Context + Custom Hooks
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js + TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL (Neon.tech)
- **Security:** Helmet, express-rate-limit, bcryptjs, jsonwebtoken, Zod

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon.tech

## 🏗️ Architecture

```mermaid
graph TD
    Client[Next.js Frontend] -->|HTTPS Requests| API[Express Backend API]
    API -->|Prisma Client| DB[(PostgreSQL Database)]
    API <-->|API Calls| Groq[Groq AI API]
```

## 📦 Database Schema

```mermaid
erDiagram
    User ||--o{ SavedCollege : saves
    College ||--o{ Course : offers
    College ||--o{ SavedCollege : saved_by

    User {
        String id PK
        String name
        String email
        String password
        DateTime createdAt
    }

    College {
        String id PK
        String name
        String slug
        String location
        Int minFees
        Int maxFees
        Float placementPercent
        Float avgPackage
        String type
    }

    Course {
        String id PK
        String collegeId FK
        String name
        String degree
        Int fees
    }

    SavedCollege {
        String id PK
        String userId FK
        String collegeId FK
    }
```

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 20+
- PostgreSQL database (local or Neon)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/VishalGastu30/Campiq.git
cd Campiq
\`\`\`

### 2. Setup Environment Variables
Create `.env` in the `backend/` directory:
\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/campiq?schema=public"
JWT_SECRET="your-super-secret-key"
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
GROQ_API_KEY="your-groq-api-key"
\`\`\`

Create `.env.local` in the `frontend/` directory:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
\`\`\`

### 3. Install Dependencies
\`\`\`bash
npm run install:all
\`\`\`

### 4. Database Setup & Seeding
\`\`\`bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
cd ..
\`\`\`

### 5. Start Development Servers
\`\`\`bash
npm run dev
\`\`\`
The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:4000`.

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login user | No |
| `GET`  | `/api/colleges` | Get paginated/filtered colleges | No |
| `GET`  | `/api/colleges/:slug` | Get college details | No |
| `GET`  | `/api/colleges/compare` | Get data for comparison | No |
| `GET`  | `/api/saved` | Get user's saved colleges | Yes |
| `POST` | `/api/saved` | Save a college | Yes |
| `POST` | `/api/ai/recommend` | Get AI college matches | Yes |

## 👨‍💻 Built By

**Vishal G**
Full Stack Developer
[GitHub](https://github.com/VishalGastu30)
