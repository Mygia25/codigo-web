// genkit.config.ts
import { configure } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import './valeria.codex'; // Ensures your codex actions are registered

export default configure({
  plugins: [
    googleAI({
      // Genkit will typically pick up GOOGLE_API_KEY or GOOGLE_GENERATIVE_LANGUAGE_API_KEY
      // from your .env file or shell environment. You can explicitly pass it here if needed:
      // apiKey: process.env.GOOGLE_API_KEY, 
    }),
  ],
  // For simpler local development without needing Firebase Firestore for Genkit's internal state:
  flowStateStore: 'devLocalMemory',
  traceStore: 'localFile', // Traces will be stored in .genkit/traces
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
