import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai'; // Corrected to lowercase googleAI

// Let TypeScript infer the type of the plugins array
const plugins = [];

// Check for Google API Key for the googleAI plugin
const googleApiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_LANGUAGE_API_KEY;

if (googleApiKey) {
    plugins.push(googleAI()); // Use lowercase googleAI here as well
} else {
    console.warn(
        "[Genkit Init] GOOGLE_API_KEY or GOOGLE_GENERATIVE_LANGUAGE_API_KEY is not set." +
        " Google AI plugin will not be available. Flows relying on it may fail at runtime."
    );
}

export const ai = genkit({
    plugins: plugins,
    model: 'googleai/gemini-2.0-flash',
    // Ensure other necessary Genkit configurations are present if needed
});
