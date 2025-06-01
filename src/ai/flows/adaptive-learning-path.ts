'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a personalized learning path based on user progress, interests, and needs.
 *
 * - `generateAdaptiveLearningPath` -  A function that generates a personalized learning path.
 * - `AdaptiveLearningPathInput` - The input type for the `generateAdaptiveLearningPath` function.
 * - `AdaptiveLearningPathOutput` - The output type for the `generateAdaptiveLearningPath` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptiveLearningPathInputSchema = z.object({
  userProgress: z
    .string()
    .describe('The user progress in the CÓDIGO method modules.'),
  userInterests: z
    .string()
    .describe('The user interests related to the CÓDIGO method.'),
  userNeeds: z.string().describe('The user needs in learning the CÓDIGO method.'),
  availableCourses: z
    .string()
    .describe('A list of available courses in the platform, with their descriptions.'),
});
export type AdaptiveLearningPathInput = z.infer<typeof AdaptiveLearningPathInputSchema>;

const AdaptiveLearningPathOutputSchema = z.object({
  learningPath: z
    .string()
    .describe('A personalized learning path with a list of courses.'),
});
export type AdaptiveLearningPathOutput = z.infer<typeof AdaptiveLearningPathOutputSchema>;

export async function generateAdaptiveLearningPath(input: AdaptiveLearningPathInput): Promise<AdaptiveLearningPathOutput> {
  return adaptiveLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptiveLearningPathPrompt',
  input: {schema: AdaptiveLearningPathInputSchema},
  output: {schema: AdaptiveLearningPathOutputSchema},
  prompt: `You are an AI assistant designed to create personalized learning paths for users of the CÓDIGO method. Based on the user's progress, interests, and needs, create an adaptive learning path by selecting the most relevant courses from the available courses.

User Progress: {{{userProgress}}}
User Interests: {{{userInterests}}}
User Needs: {{{userNeeds}}}

Available Courses: {{{availableCourses}}}

Create a personalized learning path with a list of course names that best suits the user's specific needs and interests, given their current progress. The learning path must make efficient use of courses available.`,
});

const adaptiveLearningPathFlow = ai.defineFlow(
  {
    name: 'adaptiveLearningPathFlow',
    inputSchema: AdaptiveLearningPathInputSchema,
    outputSchema: AdaptiveLearningPathOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
