# 🎥 Campiq: Loom Video Presentation Guide

To land the internship, your video needs to show three things: **Product Sense** (the app looks good and solves a problem), **Technical Depth** (you understand *how* it works under the hood), and **Communication** (you can explain it clearly).

Here is a foolproof, 6-minute script designed to make you sound like a senior developer. 

---

## 🛠️ Prep Work (Do this before hitting record)
1. **Open these tabs in order:**
   - The live Vercel URL (Homepage)
   - The live Render URL (`/api/health` or `/api/colleges` to show raw JSON)
   - Your GitHub Repository
   - VS Code (open to `backend/src/services/college.service.ts` or `frontend/src/app/page.tsx`)
2. **Pre-login:** Have a test user already signed up, but be logged out so you can show the flow.
3. **Lighting & Audio:** Sit facing a window. Use headphones with a mic if your laptop mic is echoey.
4. **Energy:** Smile, speak 10% louder and faster than your normal speaking voice. It conveys confidence.

---

## ⏱️ The 6-Minute Script

### 1. Introduction (0:00 - 0:30)
*Action: Show the live Vercel Homepage.*
> "Hi team! My name is Vishal, and this is my submission for the College Discovery Platform task, which I've named **Campiq**. My goal was to build a production-ready, highly responsive application. The stack I chose is Next.js 14 for the frontend, Node.js with Express and TypeScript for the backend, and PostgreSQL with Prisma for the database."

### 2. Product Walkthrough - Explore & Detail (0:30 - 2:00)
*Action: Scroll down the homepage, then click 'View all colleges' or search for 'IIT'.*
> "Let me walk you through the core user journey. On the Explore page, users can search and filter through over 200 real Indian colleges that I scraped and seeded into the database. 
> 
> *Action: Type 'Delhi' in search, and move the fees slider.*
> "The search features debouncing to prevent API spam, and all filtering—including state, fees, and type—is handled efficiently on the backend using Prisma queries."
> 
> *Action: Click on a college card to open the detail page.*
> "If we click into a college like IIT Delhi, we get a detailed view utilizing Next.js dynamic routing. I focused heavily on the UI/UX here using Tailwind CSS and Framer Motion for smooth tab transitions between Overview, Courses, and Placements."

### 3. The Highlight: Compare Feature (2:00 - 3:00)
*Action: Add 2-3 colleges to the compare list. Click 'Compare Now'.*
> "The assignment highlighted the Compare feature as high priority, so I made sure it was seamless. Users can add up to three colleges from anywhere in the app. The state is managed globally using React Context. 
> 
> When we go to the Compare table, it fetches the full profiles and renders a side-by-side view. I added logic to automatically highlight the 'best value' in green—like the lowest fees or highest placement percentage, making decision-making easier for students."

### 4. Auth & AI Counselor (3:00 - 4:30)
*Action: Go to login, log in, go to 'Saved' page. Then open the AI Counselor modal.*
> "I also implemented full JWT-based authentication from scratch using bcrypt for password hashing. Once logged in, users can save colleges to their personal shortlist, which persists to the PostgreSQL database.
> 
> As a bonus feature, I integrated an **AI Counselor**. By hooking into the Groq API using the LLaMA 3.3 70B model, students can input their budget and stream, and the AI streams back personalized recommendations based on the actual database context."

### 5. Technical Deep Dive (4:30 - 5:30)
*Action: Switch to VS Code. Show the `college.service.ts` file or `schema.prisma`.*
> "Looking under the hood, I'm really proud of the backend architecture. I used a Controller-Service pattern to keep the Express routes clean. 
> 
> *Action: Point at the Prisma schema or a specific query.*
> "For the database, I used Prisma ORM. This ensured total type safety between my database schema and my TypeScript code. I also implemented security best practices like Helmet for HTTP headers, express-rate-limit to prevent brute force attacks, and Zod for strict runtime payload validation."

### 6. Conclusion (5:30 - 6:00)
*Action: Switch back to the live Homepage or your GitHub repo.*
> "The entire application is deployed live—the database is hosted on Neon, the backend on Render, and the frontend on Vercel, with proper CORS configuration. 
> 
> I really enjoyed this challenge. Given more time, I would add Redis caching for the search endpoint and implement a dedicated Admin dashboard for data entry. Thank you for your time, and I look forward to discussing the code with you!"

---

## 💡 Pro-Tips for Success
- **Don't restart if you stumble:** If you trip over a word, just correct yourself and keep going. It makes you look natural and human. You don't need a flawless take.
- **Use your hands/mouse:** When you mention a technology like "Next.js", wiggle your mouse over the Next.js logo if it's on screen, or highlight the code you are talking about.
- **Focus on the "Why":** Junior devs say *"I used Prisma"*. Senior devs say *"I used Prisma because it guarantees type safety and makes schema migrations reliable."* (The script above is written with the Senior mindset).
