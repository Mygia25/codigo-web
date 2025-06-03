import { genkit } from 'genkit';
import { type GenkitPlugin } from '@genkit-ai/core'; // Import GenkitPlugin from @genkit-ai/core
import { googleAI } from '@genkit-ai/googleai';

const plugins: GenkitPlugin[] = [];

// Check for Google API Key for the googleAI plugin
const googleApiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_LANGUAGE_API_KEY;

if (googleApiKey) {
  plugins.push(googleAI());
} else {
  // Log a warning if the API key is missing.
  // This will be visible during the build process and server runtime if the key isn't set.
  console.warn(
    "[Genkit Init] GOOGLE_API_KEY or GOOGLE_GENERATIVE_LANGUAGE_API_KEY is not set." +
    " Google AI plugin will not be available. Flows relying on it may fail at runtime."
  );
  // Note: If no model-providing plugins are loaded, Genkit calls like ai.generate().
}

export const ai = genkit({
  plugins: plugins,
  // The model property here is a default model suggestion for Genkit.
  // It will only be usable if the googleAI plugin is successfully loaded (i.e., API key is present).
  // If the googleAI plugin is not loaded, and no other plugins provide this model,
  // attempts to use 'googleai/gemini-2.0-flash' will fail at runtime.
  model: 'googleai/gemini-2.0-flash',
});