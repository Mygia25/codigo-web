
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
  skills: z.string().describe('The user’s current skills.'),
  knowledge: z.string().describe('The user’s existing knowledge.'),
  passions: z.string().describe('The user’s passions and interests.'),
  niche: z.string().describe('The specific niche for the course.'),
  language: z.string().describe('The target language for the course content (e.g., "Español", "English").'),
});
export type PersonalizedCourseInput = z.infer<typeof PersonalizedCourseInputSchema>;

const PersonalizedCourseOutputSchema = z.object({
  courseTitle: z.string().describe('The title of the personalized course.'),
  courseDescription: z.string().describe('A brief description of the course.'),
  modules: z.array(z.object({
    moduleTitle: z.string().describe('Title of the module.'),
    moduleDescription: z.string().describe('Brief description of what will be covered in the module.'),
    lessons: z.array(z.object({
      lessonTitle: z.string().describe('Title of the lesson.'),
      topics: z.array(z.string()).describe('List of specific topic names covered in this lesson. Each topic should be a concise phrase.')
    })).describe('List of lessons within the module. Each lesson should have between 2 to 5 topics.')
  })).describe('A detailed outline of the course content, structured into modules. Each module should have between 2 to 4 lessons.'),
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
  prompt: `You are an expert course creator. A user will provide their skills, knowledge, passions, niche, and desired language, and you will generate a personalized course tailored to them in the specified language.

Skills: {{{skills}}}
Knowledge: {{{knowledge}}}
Passions: {{{passions}}}
Niche: {{{niche}}}
Language: {{{language}}}

Based on this information, create a personalized course. The course should include:
1.  'courseTitle': A compelling title for the course in the specified '{{language}}'.
2.  'courseDescription': A brief, engaging description of what the course offers in '{{language}}'.
3.  'modules': A detailed content outline structured as an array of module objects. All text content within modules, lessons, and topics must be in '{{language}}'.
    *   Each module object must have:
        *   'moduleTitle': A clear title for the module.
        *   'moduleDescription': A brief summary of the module's content and objectives.
        *   'lessons': An array of lesson objects within that module. Aim for 2 to 4 lessons per module.
            *   Each lesson object must have:
                *   'lessonTitle': A specific title for the lesson.
                *   'topics': An array of strings, where each string is a concise topic name (e.g., "Understanding X", "Implementing Y", "Advanced techniques for Z"). Aim for 2 to 5 topics per lesson.

Return the result strictly in the specified JSON format. Ensure the 'modules' key contains the structured array as described and all textual content is in the language specified: '{{language}}'.
Example of a lesson's topics array: ["Introduction to Topic A", "Core Concepts of Topic A", "Practical Application of Topic A"]
`,
});

const personalizedCourseFlow = ai.defineFlow(
  {
    name: 'personalizedCourseFlow',
    inputSchema: PersonalizedCourseInputSchema,
    outputSchema: PersonalizedCourseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate course content in the expected format.");
    }
    // Add unique IDs to modules and lessons for client-side key props
    const outputWithIds = {
        ...output,
        modules: output.modules.map(module => ({
            ...module,
            id: `mod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            lessons: module.lessons.map(lesson => ({
                ...lesson,
                id: `les-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            }))
        }))
    };
    return outputWithIds;
  }
);

