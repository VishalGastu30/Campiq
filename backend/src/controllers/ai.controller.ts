import { Response, NextFunction } from 'express';
import { Groq } from 'groq-sdk';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export class AiController {
  async getRecommendations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { stream, budget, priority, state } = req.body;
      
      if (!stream || !budget || !priority) {
        return res.status(400).json({ success: false, error: { message: 'Missing required fields' } });
      }

      // 1. Fetch potential colleges from DB to give to the LLM context
      // We do a loose filter so the LLM has real options to choose from
      const where: any = {};
      if (state && state !== 'Any') {
        where.state = state;
      }
      
      const potentialColleges = await prisma.college.findMany({
        where,
        take: 30, // Give it top 30 to choose from
        orderBy: { rating: 'desc' },
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
          minFees: true,
          maxFees: true,
          rating: true,
          placementPercent: true,
          avgPackage: true,
          type: true,
        }
      });

      const contextData = potentialColleges.map(c => 
        `ID: ${c.id} | Name: ${c.name} | Location: ${c.city}, ${c.state} | Type: ${c.type} | Fees: ₹${c.minFees}-₹${c.maxFees} | Rating: ${c.rating} | Placement: ${c.placementPercent}% | Avg Pkg: ${c.avgPackage}LPA`
      ).join('\n');

      const prompt = `
        You are an expert college counselor for Indian students.
        User Profile:
        - Stream of Interest: ${stream}
        - Budget constraint: ${budget}
        - Main priority: ${priority}
        
        Available Colleges Data:
        ${contextData}
        
        Analyze the user profile and available colleges. Select exactly 3 colleges that best fit the criteria.
        For each, provide a match score (out of 100) and a brief, 2-sentence personalized reason why it fits their specific profile.
        
        Output strictly in valid JSON format:
        {
          "recommendations": [
            {
              "id": "exact_id_from_data",
              "matchScore": 95,
              "reason": "Personalized reason here."
            }
          ]
        }
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.1,
        response_format: { type: 'json_object' },
      });

      const responseContent = chatCompletion.choices[0]?.message?.content;
      if (!responseContent) throw new Error('No response from AI');

      const parsedResponse = JSON.parse(responseContent);
      
      // Map back to full college objects
      const finalRecs = await Promise.all(
        parsedResponse.recommendations.map(async (rec: any) => {
          const college = await prisma.college.findUnique({
            where: { id: rec.id },
            include: { courses: true }
          });
          return {
            college,
            matchScore: rec.matchScore,
            reason: rec.reason
          };
        })
      );
      
      // Filter out any nulls if ID wasn't found
      res.json({ success: true, recommendations: finalRecs.filter(r => r.college) });

    } catch (error) {
      console.error('AI Error:', error);
      next(error);
    }
  }
}

export const aiController = new AiController();
