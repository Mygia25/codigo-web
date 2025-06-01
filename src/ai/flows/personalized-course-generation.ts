'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized courses based on user's skills, knowledge, and passions.
 *
 * - generatePersonalizedCourse - A function that generates a personalized course.
 * - PersonalizedCourseInput - The input type for the generatePersonalizedCourse function.
 * - PersonalizedCourseOutput - The return type for the generatePersonalizedCourse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedCourseInputSchema = z.object({
  skills: z.string().describe('The user\u2019s current skills.'),
  knowledge: z.string().describe('The user\u2019s existing knowledge.'),
  passions: z.string().describe('The user\u2019s passions and interests.'),
  niche: z.string().describe('The specific niche for the course.'),
});
export type PersonalizedCourseInput = z.infer<typeof PersonalizedCourseInputSchema>;

const PersonalizedCourseOutputSchema = z.object({
  courseTitle: z.string().describe('The title of the personalized course.'),
  courseDescription: z.string().describe('A brief description of the course.'),
  courseContent: z.string().describe('A detailed outline of the course content, including modules and topics.'),
});
export type PersonalizedCourseOutput = z.infer<typeof PersonalizedCourseOutputSchema>;

export async function generatePersonalizedCourse(
  input: PersonalizedCourseInput
): Promise<PersonalizedCourseOutput> {
  return personalizedCourseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedCoursePrompt',
  input: {schema: PersonalizedCourseInputSchema},
  output: {schema: PersonalizedCourseOutputSchema},
  prompt: `You are an expert course creator. A user will provide their skills, knowledge, passions, and niche, and you will generate a personalized course tailored to them.

Skills: {{{skills}}}
Knowledge: {{{knowledge}}}
Passions: {{{passions}}}
Niche: {{{niche}}}

Based on this information, create a personalized course with a title, description, and detailed content outline. Return the result in JSON format.`,
});

const personalizedCourseFlow = ai.defineFlow(
  {
    name: 'personalizedCourseFlow',
    inputSchema: PersonalizedCourseInputSchema,
    outputSchema: PersonalizedCourseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
