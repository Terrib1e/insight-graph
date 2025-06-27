import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { nodeId, label } = await request.json();

    if (!nodeId || !label) {
      return NextResponse.json(
        { error: 'nodeId and label are required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Expand the concept: "${label}"

Generate 3-5 MORE related concepts that are closely connected to "${label}". Focus on:
- Sub-concepts and specialized areas
- Practical applications
- Related technologies or methods
- Advanced topics
- Cross-disciplinary connections

Return JSON:
{
  "concepts": [
    {
      "id": "unique-id",
      "label": "Concept Name",
      "description": "Brief description",
      "connections": []
    }
  ],
  "connections": [
    {
      "source": "${nodeId}",
      "target": "new-concept-id",
      "label": "relationship"
    }
  ]
}

Make sure all new concepts connect back to the original concept. Only return valid JSON.`;

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
      // Fallback: create related concepts
      const relatedConcepts = [
        `Advanced ${label}`,
        `${label} Applications`,
        `${label} Theory`
      ];

      parsedResponse = {
        concepts: relatedConcepts.map((concept) => ({
          id: uuidv4(),
          label: concept,
          description: `Related to ${label}`,
          connections: [nodeId]
        })),
        connections: relatedConcepts.map((concept, index) => ({
          source: nodeId,
          target: uuidv4(),
          label: 'related to'
        }))
      };
    }

    // Ensure unique IDs and proper connections
    if (parsedResponse.concepts) {
      parsedResponse.concepts = parsedResponse.concepts.map((concept: any) => ({
        ...concept,
        id: concept.id || uuidv4(),
        connections: concept.connections || []
      }));

      // Update connection targets to match actual concept IDs
      if (parsedResponse.connections) {
        parsedResponse.connections = parsedResponse.connections.map((conn: any, index: number) => ({
          ...conn,
          source: nodeId,
          target: parsedResponse.concepts[index]?.id || conn.target
        }));
      }
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error('Error in expand node API:', error);
    return NextResponse.json(
      { error: 'Failed to expand node' },
      { status: 500 }
    );
  }
}