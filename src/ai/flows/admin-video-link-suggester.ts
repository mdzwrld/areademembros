'use server';
/**
 * @fileOverview This file provides a Genkit flow for an AI assistant to suggest "Necessary Links" content for videos.
 *
 * - suggestVideoLinks - A function that generates suggested links based on video title and description.
 * - AdminVideoLinkSuggesterInput - The input type for the suggestVideoLinks function.
 * - AdminVideoLinkSuggesterOutput - The return type for the suggestVideoLinks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminVideoLinkSuggesterInputSchema = z.object({
  videoTitle: z.string().describe('The title of the video.'),
  videoDescription: z.string().describe('A brief description of the video content.'),
});
export type AdminVideoLinkSuggesterInput = z.infer<typeof AdminVideoLinkSuggesterInputSchema>;

const AdminVideoLinkSuggesterOutputSchema = z.string().describe(
  'Suggested "Necessary Links" content for the video, formatted as a multi-line string with clear call-to-actions or resource links. Each line should represent a distinct link or resource idea.'
);
export type AdminVideoLinkSuggesterOutput = z.infer<typeof AdminVideoLinkSuggesterOutputSchema>;

const suggestVideoLinksPrompt = ai.definePrompt({
  name: 'suggestVideoLinksPrompt',
  input: {schema: AdminVideoLinkSuggesterInputSchema},
  output: {schema: AdminVideoLinkSuggesterOutputSchema},
  prompt: `You are an AI assistant tasked with generating compelling and relevant "Necessary Links" content for videos.
Your goal is to provide useful resources or calls-to-action that complement the video's content.
The output should be a multi-line string, with each line representing a distinct link or resource idea. Do not include introductory or concluding remarks, just the formatted list of links.
Focus on suggesting the *type* of link or content that would be relevant, e.g., "Buy [Product Name] here" or "Join our Discord for support".

Video Title: {{{videoTitle}}}
Video Description: {{{videoDescription}}}

Please suggest "Necessary Links" content for this video.`,
});

const adminVideoLinkSuggesterFlow = ai.defineFlow(
  {
    name: 'adminVideoLinkSuggesterFlow',
    inputSchema: AdminVideoLinkSuggesterInputSchema,
    outputSchema: AdminVideoLinkSuggesterOutputSchema,
  },
  async input => {
    const {output} = await suggestVideoLinksPrompt(input);
    return output!;
  }
);

export async function suggestVideoLinks(
  input: AdminVideoLinkSuggesterInput
): Promise<AdminVideoLinkSuggesterOutput> {
  return adminVideoLinkSuggesterFlow(input);
}
