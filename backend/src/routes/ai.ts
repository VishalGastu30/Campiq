// src/routes/ai.ts
import { Router } from 'express';
import { z } from 'zod';
import Groq from 'groq-sdk';
import { prisma } from '../lib/prisma';

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const recommendSchema = z.object({
  stream:   z.enum(['ENGINEERING', 'MANAGEMENT', 'MEDICAL', 'LAW', 'ARTS', 'SCIENCE', 'COMMERCE', 'DESIGN', 'PHARMACY', 'AGRICULTURE']),
  budget:   z.number().min(0),
  state:    z.string().optional(),
  priority: z.array(z.enum(['placements', 'fees', 'ranking', 'research', 'campus'])).min(1),
  score:    z.string().optional(),
});

const COLLEGE_SELECT = {
  id: true, slug: true, name: true, shortName: true,
  city: true, state: true, type: true,
  nirfRank: true, naacGrade: true,
  minFees: true, maxFees: true,
  placementPercent: true, avgPackage: true,
  streams: true, examsAccepted: true,
  imageUrl: true, logoUrl: true,
  highlights: true, about: true,
};

router.post('/recommend', async (req, res) => {
  try {
    const prefs = recommendSchema.parse(req.body);
    console.log('[AI] Request received:', JSON.stringify(prefs));

    // Step 1: Try filtering by stream first
    let candidates = await prisma.college.findMany({
      where: {
        streams: { has: prefs.stream },
        ...(prefs.budget > 0 ? { minFees: { lte: prefs.budget } } : {}),
        ...(prefs.state && prefs.state !== 'Any' ? { state: { contains: prefs.state, mode: 'insensitive' as const } } : {}),
      },
      orderBy: { nirfRank: { sort: 'asc', nulls: 'last' } },
      take: 20,
      select: COLLEGE_SELECT,
    });
    console.log(`[AI] Stream filter: ${candidates.length} colleges`);

    // Step 2: Fallback — if no stream match, query ALL colleges
    if (candidates.length === 0) {
      console.log('[AI] No stream match, falling back to all colleges');
      candidates = await prisma.college.findMany({
        where: {
          ...(prefs.budget > 0 ? { minFees: { lte: prefs.budget } } : {}),
          ...(prefs.state && prefs.state !== 'Any' ? { state: { contains: prefs.state, mode: 'insensitive' as const } } : {}),
        },
        orderBy: { nirfRank: { sort: 'asc', nulls: 'last' } },
        take: 20,
        select: COLLEGE_SELECT,
      });
      console.log(`[AI] Fallback: ${candidates.length} colleges`);
    }

    // Step 3: Still nothing? Return empty
    if (candidates.length === 0) {
      return res.json({
        success: true,
        data: { recommendations: [], message: 'No colleges match your filters. Try widening your criteria.' }
      });
    }

    // Step 4: Build compact summary for Groq
    const summary = candidates.map(c => ({
      id: c.id, name: c.name, city: c.city, state: c.state,
      nirfRank: c.nirfRank, minFees: c.minFees, maxFees: c.maxFees,
      placementPercent: c.placementPercent, avgPackage: c.avgPackage, naacGrade: c.naacGrade,
    }));

    const prompt = `You are an expert Indian college admissions advisor.

STUDENT PREFERENCES:
- Stream: ${prefs.stream}
- Max annual budget: ₹${(prefs.budget / 100000).toFixed(1)} Lakhs
- Preferred state: ${prefs.state || 'Anywhere in India'}
- Top priorities: ${prefs.priority.join(', ')}
${prefs.score ? `- Entrance score/rank: ${prefs.score}` : ''}

AVAILABLE COLLEGES:
${JSON.stringify(summary, null, 2)}

Pick the best 3-5 colleges. Return ONLY this JSON:
{
  "recommendations": [
    {
      "collegeId": "string",
      "collegeName": "string",
      "matchScore": number,
      "reason": "2 sentences with specific numbers from the data"
    }
  ]
}
Order by matchScore descending.`;

    console.log('[AI] Calling Groq...');

    // Step 5: Call Groq with timeout
    const groqPromise = groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 1000,
    });
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI timed out after 30s')), 30000)
    );
    const response = await Promise.race([groqPromise, timeout]) as any;

    console.log('[AI] Groq responded');

    const result = JSON.parse(response.choices[0]?.message?.content || '{}');
    if (!result.recommendations || !Array.isArray(result.recommendations)) {
      throw new Error('AI returned unexpected format');
    }

    // Step 6: Attach full college objects for the frontend CollegeCard
    const recs = result.recommendations
      .map((rec: any) => ({
        ...rec,
        college: candidates.find(c => c.id === rec.collegeId) || null,
      }))
      .filter((rec: any) => rec.college !== null);

    console.log(`[AI] Returning ${recs.length} recommendations`);
    res.json({ success: true, data: { recommendations: recs } });

  } catch (err: any) {
    console.error('[AI ERROR]', err.message || err);
    return res.status(500).json({
      success: false,
      error: { code: 'AI_ERROR', message: err.message || 'AI recommendation temporarily unavailable.' }
    });
  }
});

export { router as aiRoutes };
