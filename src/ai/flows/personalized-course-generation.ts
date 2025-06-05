// src/ai/flows/personalized-course-generation.ts
import { genkit } from 'genkit';
import { defineFlow } from '@genkit-ai/flow';
import { ai } from '../genkit'; // Corrected path to the AI client

// Import Schemas and Types from the dedicated types file
import {
  PersonalizedCourseInputSchema,
  type PersonalizedCourseInput,
  PersonalizedCourseOutputSchema,
  type PersonalizedCourseOutput,
  type PersonalizedCourseModuleWithId,
  type PersonalizedCourseLessonWithId,
  type PersonalizedCourseWithIdsOutput
} from '@/types/course-generation';

// Create the Genkit flow
export const personalizedCourseFlow = defineFlow(
  {
    name: 'personalizedCourseFlow',
    inputSchema: PersonalizedCourseInputSchema,
    outputSchema: PersonalizedCourseOutputSchema,
  },
  async (input: PersonalizedCourseInput): Promise<PersonalizedCourseOutput> => {
    const prompt = `Generate a personalized course structure based on the following user details: Skills: ${input.skills}, Knowledge: ${input.knowledge}, Passions: ${input.passions}, Niche: ${input.niche}. The course should be in ${input.language}.`;

    const llmResponse = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.0-flash', // Ensure this model is available and configured
      output: { schema: PersonalizedCourseOutputSchema },
    });
    return llmResponse.output() || { courseTitle: 'Error', courseDescription: 'Error generating course', modules: [] };
  }
);

// Function to generate the course and add IDs
export async function generatePersonalizedCourse(
  input: PersonalizedCourseInput
): Promise<PersonalizedCourseWithIdsOutput> {
  const aiOutput = await personalizedCourseFlow(input);

  const modulesWithIds: PersonalizedCourseModuleWithId[] = aiOutput.modules.map((module, moduleIndex) => ({
    ...module,
    id: `mod-${Date.now()}-${moduleIndex}`,
    lessons: module.lessons.map((lesson, lessonIndex) => ({
      ...lesson,
      id: `les-${Date.now()}-${moduleIndex}-${lessonIndex}`,
    })),
  }));

  return {
    ...aiOutput,
    modules: modulesWithIds,
  };
}
