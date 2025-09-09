'use server';
/**
 * @fileOverview An AI agent that identifies a plant from an image and provides information about it.
 *
 * - identifyPlantFromImage - A function that handles the plant identification process.
 * - IdentifyPlantFromImageInput - The input type for the identifyPlantFromImage function.
 * - IdentifyPlantFromImageOutput - The return type for the identifyPlantFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyPlantFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyPlantFromImageInput = z.infer<typeof IdentifyPlantFromImageInputSchema>;

const IdentifyPlantFromImageOutputSchema = z.object({
  plantName: z.string().describe('The common name of the plant.'),
  organName: z.string().describe('The specific organ shown in the image (e.g., leaf, flower, stem).'),
  speciesName: z.string().describe('The scientific name of the plant species.'),
  healthStatus: z.string().describe('The overall health status of the plant (e.g., healthy, diseased).'),
  confidenceScores: z.object({
    plantName: z.number().describe('Confidence score for the plant name identification (0-1).'),
    organName: z.number().describe('Confidence score for the organ name identification (0-1).'),
    speciesName: z.number().describe('Confidence score for the species name identification (0-1).'),
    healthStatus: z.number().describe('Confidence score for the health status identification (0-1).'),
  }).optional().describe('Confidence scores for each identified attribute, ranging from 0 to 1.'),
});
export type IdentifyPlantFromImageOutput = z.infer<typeof IdentifyPlantFromImageOutputSchema>;

export async function identifyPlantFromImage(input: IdentifyPlantFromImageInput): Promise<IdentifyPlantFromImageOutput> {
  return identifyPlantFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyPlantFromImagePrompt',
  input: {schema: IdentifyPlantFromImageInputSchema},
  output: {schema: IdentifyPlantFromImageOutputSchema},
  prompt: `You are an expert botanist who can identify plants from images.

  Analyze the image provided and identify the following attributes of the plant:

  - Plant Name: The common name of the plant.
  - Organ Name: The specific organ shown in the image (e.g., leaf, flower, stem).
  - Species Name: The scientific name of the plant species.
  - Health Status: The overall health status of the plant (e.g., healthy, diseased).

  Provide confidence scores (0-1) for each identified attribute. If unable to determine a particular attribute, indicate with a low confidence score.

  Image: {{media url=photoDataUri}}
  `,
});

const identifyPlantFromImageFlow = ai.defineFlow(
  {
    name: 'identifyPlantFromImageFlow',
    inputSchema: IdentifyPlantFromImageInputSchema,
    outputSchema: IdentifyPlantFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
