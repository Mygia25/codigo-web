// src/ai/flows/personalized-course-generation.ts
import { defineFlow } from '@genkit-ai/flow';
// Correctly import the initialized Genkit AI client from your project's genkit.ts
import { ai } from '../genkit'; 

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

// 1. Create the Genkit flow
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
      model: 'googleai/gemini-2.0-flash', 
      output: { schema: PersonalizedCourseOutputSchema },
    });

    const out = llmResponse.output; // Used as a getter

    if (!out) {
      console.error("LLM response output was null or undefined.", llmResponse);
      return { 
        courseTitle: "Error", 
        courseDescription: "Failed to generate course content or output was empty.", 
        modules: [] 
      };
    }
    return out; 
  }
);

// 2. Function that calls the flow and adds IDs manually
export async function generatePersonalizedCourse(
  input: PersonalizedCourseInput
): Promise<PersonalizedCourseWithIdsOutput> {
  // Corrected: Use .run() to execute the Genkit flow
  const aiOutput = await personalizedCourseFlow.run(input); 

  if (aiOutput.courseTitle === "Error" || !aiOutput.modules) {
    return {
        courseTitle: aiOutput.courseTitle,
        courseDescription: aiOutput.courseDescription,
        modules: [] 
    };
  }

  const modulesWithIds: PersonalizedCourseModuleWithId[] = aiOutput.modules.map((module, i) => ({
    ...module,
    id: `mod-${Date.now()}-${i}`,
    lessons: module.lessons.map((les, j) => ({
      ...les,
      id: `les-${Date.now()}-${i}-${j}`,
    })),
  }));

  return {
    ...aiOutput,
    modules: modulesWithIds,
  };
}
