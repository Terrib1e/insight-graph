import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { seeds } = await request.json();

    if (!seeds || !Array.isArray(seeds) || seeds.length === 0) {
      return NextResponse.json(
        { error: 'Seeds array is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Given the seed topics: ${seeds.join(', ')}

Generate a JSON response with related concepts:
{
  "concepts": [
    {
      "id": "unique-id",
      "label": "Concept Name",
      "description": "Brief description",
      "connections": ["id1", "id2"]
    }
  ],
  "connections": [
    {
      "source": "concept-id",
      "target": "concept-id",
      "label": "relationship"
    }
  ]
}

Provide 5-8 concepts per seed topic. Only return valid JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let parsedResponse;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      // Fallback response
      parsedResponse = {
        concepts: seeds.map((seed: string) => ({
          id: uuidv4(),
          label: seed,
          description: `Core concept: ${seed}`,
          connections: []
        })),
        connections: []
      };
    }

    // Ensure unique IDs
    if (parsedResponse.concepts) {
      parsedResponse.concepts = parsedResponse.concepts.map((concept: any) => ({
        ...concept,
        id: concept.id || uuidv4(),
        connections: concept.connections || []
      }));
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error('Error in related concepts API:', error);
    return NextResponse.json(
      { error: 'Failed to generate related concepts' },
      { status: 500 }
    );
  }
}