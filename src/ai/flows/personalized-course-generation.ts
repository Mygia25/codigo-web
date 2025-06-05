// src/ai/flows/personalized-course-generation.ts
import { defineFlow } from '@genkit-ai/flow';
import ai from '@genkit-ai/googleai'; // Corrected to default import

// Import Schemas y Types desde el archivo dedicado
import {
  PersonalizedCourseInputSchema,
  type PersonalizedCourseInput,
  PersonalizedCourseOutputSchema,
  type PersonalizedCourseOutput,
  type PersonalizedCourseModuleWithId,
  type PersonalizedCourseLessonWithId,
  type PersonalizedCourseWithIdsOutput
} from '@/types/course-generation';

// 1. Crear el flujo de Genkit
export const personalizedCourseFlow = defineFlow(
  {
    name: 'personalizedCourseFlow',
    inputSchema: PersonalizedCourseInputSchema,
    outputSchema: PersonalizedCourseOutputSchema,
  },
  async (input: PersonalizedCourseInput): Promise<PersonalizedCourseOutput> => {
    const prompt = `
      Generate a personalized course structure based on the following user details:
      Skills: ${input.skills},
      Knowledge: ${input.knowledge},
      Passions: ${input.passions},
      Niche: ${input.niche}.
      The course should be in ${input.language}.
    `;

    const llmResponse = await ai.generate({
      prompt,
      model: 'googleai/gemini-2.0-flash', // Ensure this model is configured
      output: { schema: PersonalizedCourseOutputSchema },
    });

    // Corrected null check for strict mode
    const out = llmResponse.output();
    return out || {
      courseTitle: 'Error',
      courseDescription: 'Error generating course',
      modules: [],
    };
  }
);

// 2. Función que llama al flujo y agrega IDs manualmente
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
