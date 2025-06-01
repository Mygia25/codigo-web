'use server';

/**
 * @fileOverview An AI agent that provides personalized guidance and strategic support for users navigating the CÓDIGO method.
 *
 * - provideIACodigoGuidance - A function that provides personalized guidance based on user input.
 * - IACodigoGuidanceInput - The input type for the provideIACodigoGuidance function.
 * - IACodigoGuidanceOutput - The return type for the provideIACodigoGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IACodigoGuidanceInputSchema = z.object({
  userInput: z.string().describe('The user input or question about the CÓDIGO method.'),
  userProgress: z
    .string()
    .optional()
    .describe('Optional: Description of the user current progress in the CÓDIGO method.'),
});
export type IACodigoGuidanceInput = z.infer<typeof IACodigoGuidanceInputSchema>;

const IACodigoGuidanceOutputSchema = z.object({
  guidance: z.string().describe('The personalized guidance and strategic support provided by the AI agent.'),
});
export type IACodigoGuidanceOutput = z.infer<typeof IACodigoGuidanceOutputSchema>;

export async function provideIACodigoGuidance(input: IACodigoGuidanceInput): Promise<IACodigoGuidanceOutput> {
  return iaCodigoGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'iaCodigoGuidancePrompt',
  input: {schema: IACodigoGuidanceInputSchema},
  output: {schema: IACodigoGuidanceOutputSchema},
  prompt: `You are the CÓDIGO IA agent, a personal AI assistant that guides users through the CÓDIGO method, providing personalized responses and strategic support.

  A user is asking for guidance.  Provide a helpful and supportive response based on their input and current progress.

  User Input: {{{userInput}}}
  User Progress: {{{userProgress}}}
  `,
});

const iaCodigoGuidanceFlow = ai.defineFlow(
  {
    name: 'iaCodigoGuidanceFlow',
    inputSchema: IACodigoGuidanceInputSchema,
    outputSchema: IACodigoGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
