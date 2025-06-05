// src/ai/flows/personalized-course-generation.ts
import { defineFlow } from '@genkit-ai/flow';
// Correctly import the initialized Genkit AI client from your project
import { ai } from '../genkit'; // This should point to your src/ai/genkit.ts

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
    const prompt = `
      Generate a personalized course structure based on the following user details:
      Skills: ${input.skills}, 
      Knowledge: ${input.knowledge}, 
      Passions: ${input.passions}, 
      Niche: ${input.niche}.
      The course should be in ${input.language}.
    `;

    // Use the Genkit ai.generate() method
    const llmResponse = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.0-flash', // This should be the model configured in your global 'ai' instance
      output: { schema: PersonalizedCourseOutputSchema }, // Genkit uses this to structure the output
    });

    // Handle the output carefully, as it might be null
    const out = llmResponse.output(); 
    
    if (!out) {
      console.error("LLM response output was null or undefined.", llmResponse);
      return { 
        courseTitle: 'Error', 
        courseDescription: 'Failed to generate course content or output was empty.', 
        modules: [] 
      };
    }
    
    // If 'out' is not null, it should conform to PersonalizedCourseOutputSchema
    return out; 
  }
);

// Function to generate the course and add IDs
export async function generatePersonalizedCourse(
  input: PersonalizedCourseInput
): Promise<PersonalizedCourseWithIdsOutput> {
  const aiOutput = await personalizedCourseFlow(input);

  // Handle cases where aiOutput might be the error fallback from the flow
  if (aiOutput.courseTitle === 'Error' || !aiOutput.modules) {
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
