import { NextResponse } from 'next/server';
import { generatePersonalizedCourse, type PersonalizedCourseInput } from '@/ai/flows/personalized-course-generation'; // Adjust path as needed

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as PersonalizedCourseInput;

    // Basic validation (you might want more thorough validation here or in your Zod schema)
    if (!input.skills || !input.knowledge || !input.passions || !input.niche || !input.language) {
      return NextResponse.json({ error: 'Missing required input fields.' }, { status: 400 });
    }

    const courseData = await generatePersonalizedCourse(input);
    return NextResponse.json({ data: courseData });

  } catch (error: any) {
    console.error('[API generate-course] Error:', error);
    // Ensure error.message is a string, or provide a default error message
    const errorMessage = typeof error.message === 'string' ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: 'Failed to generate course', details: errorMessage }, { status: 500 });
  }
}
