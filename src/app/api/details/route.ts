import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { conceptId, label } = await request.json();

    if (!conceptId || !label) {
      return NextResponse.json(
        { error: 'conceptId and label are required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Provide detailed information about the concept: "${label}"

Return a JSON response with this structure:
{
  "id": "${conceptId}",
  "label": "${label}",
  "definition": "Clear, comprehensive 2-3 sentence definition",
  "examples": [
    "Practical example or use case 1",
    "Practical example or use case 2",
    "Practical example or use case 3"
  ],
  "resources": [
    {
      "title": "Resource title",
      "url": "https://example.com",
      "type": "article"
    },
    {
      "title": "Video title",
      "url": "https://youtube.com/watch?v=example",
      "type": "video"
    },
    {
      "title": "Documentation",
      "url": "https://docs.example.com",
      "type": "documentation"
    }
  ]
}

Guidelines:
- Definition should be accurate and accessible
- Examples should be concrete and relatable
- Provide 3-5 examples that illustrate different aspects
- Include 2-3 high-quality learning resources
- Resources should be real, well-known sources when possible
- Use appropriate resource types: article, video, documentation

Return only valid JSON.`;

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
      console.error('Error parsing AI response:', parseError);

      // Fallback response
      parsedResponse = {
        id: conceptId,
        label: label,
        definition: `${label} is an important concept that requires further study and understanding.`,
        examples: [
          `Example application of ${label}`,
          `Real-world use case of ${label}`,
          `Common scenario involving ${label}`
        ],
        resources: [
          {
            title: `Introduction to ${label}`,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(label)}`,
            type: 'article'
          }
        ]
      };
    }

    // Ensure required fields exist
    parsedResponse.id = parsedResponse.id || conceptId;
    parsedResponse.label = parsedResponse.label || label;
    parsedResponse.examples = parsedResponse.examples || [];
    parsedResponse.resources = parsedResponse.resources || [];

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error('Error in concept details API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch concept details' },
      { status: 500 }
    );
  }
}