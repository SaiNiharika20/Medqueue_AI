'use server';

/**
 * @fileOverview Provides a voice-based AI assistant to update patients on their queue status and answer common questions.
 *
 * - getQueueStatusAndFAQ - A function that provides queue updates and FAQ answers.
 * - GetQueueStatusAndFAQInput - The input type for the getQueueStatusAndFAQ function.
 * - GetQueueStatusAndFAQOutput - The return type for the getQueueStatusAndFAQ function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GetQueueStatusAndFAQInputSchema = z.object({
  patientId: z.string().describe('The patient ID.'),
  query: z.string().describe('The patient query or question.'),
});
export type GetQueueStatusAndFAQInput = z.infer<typeof GetQueueStatusAndFAQInputSchema>;

const GetQueueStatusAndFAQOutputSchema = z.object({
  response: z.string().describe('The AI assistant response in text format.'),
  audio: z.string().describe('The AI assistant response in audio format (WAV data URI).'),
});
export type GetQueueStatusAndFAQOutput = z.infer<typeof GetQueueStatusAndFAQOutputSchema>;

export async function getQueueStatusAndFAQ(input: GetQueueStatusAndFAQInput): Promise<GetQueueStatusAndFAQOutput> {
  return getQueueStatusAndFAQFlow(input);
}

const prompt = ai.definePrompt({
  name: 'queueStatusAndFAQPrompt',
  input: {schema: GetQueueStatusAndFAQInputSchema},
  prompt: `You are a helpful AI assistant providing queue status updates and answering frequently asked questions for patients.

  Patient ID: {{{patientId}}}
  Query: {{{query}}}

  Respond with the queue status, estimated wait time, and answer the patient's question using provided FAQs.
  If the question can't be answered using FAQs, respond politely that you can't answer the question.`,
});

const getQueueStatusAndFAQFlow = ai.defineFlow(
  {
    name: 'getQueueStatusAndFAQFlow',
    inputSchema: GetQueueStatusAndFAQInputSchema,
    outputSchema: GetQueueStatusAndFAQOutputSchema,
  },
  async input => {
    const {text} = await prompt(input);

    const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview-tts',
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: text,
      });

      if (!media) {
        throw new Error('no media returned');
      }

      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );

      const audio = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {
      response: text,
      audio: audio,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

