'use server';

/**
 * @fileOverview An AI agent to predict patient wait times.
 *
 * - predictWaitTime - A function that predicts the wait time for a patient.
 * - PredictWaitTimeInput - The input type for the predictWaitTime function.
 * - PredictWaitTimeOutput - The return type for the predictWaitTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictWaitTimeInputSchema = z.object({
  historicalData: z
    .string()
    .describe('Historical patient data, including arrival times, treatment durations, and outcomes.'),
  currentPatientLoad: z
    .number()
    .describe('The number of patients currently waiting or being treated.'),
  staffingLevels: z.number().describe('The current number of available staff members.'),
  timeOfDay: z.string().describe('The current time of day.'),
  dayOfWeek: z.string().describe('The current day of the week.'),
  patientAcuity: z.string().describe('Description of the patient acuity level.'),
});
export type PredictWaitTimeInput = z.infer<typeof PredictWaitTimeInputSchema>;

const PredictWaitTimeOutputSchema = z.object({
  predictedWaitTimeMinutes: z
    .number()
    .describe('The predicted wait time in minutes for the patient.'),
  confidenceLevel: z
    .string()
    .describe('A qualitative description of the confidence level in the prediction (e.g., high, medium, low).'),
  rationale: z.string().describe('The rationale behind the wait time prediction.'),
});
export type PredictWaitTimeOutput = z.infer<typeof PredictWaitTimeOutputSchema>;

export async function predictWaitTime(input: PredictWaitTimeInput): Promise<PredictWaitTimeOutput> {
  return predictWaitTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictWaitTimePrompt',
  input: {schema: PredictWaitTimeInputSchema},
  output: {schema: PredictWaitTimeOutputSchema},
  prompt: `You are an expert medical administrator with years of experience predicting patient wait times.

  Based on the following information, predict the patient wait time in minutes:

  Historical Data: {{{historicalData}}}
  Current Patient Load: {{{currentPatientLoad}}}
  Staffing Levels: {{{staffingLevels}}}
  Time of Day: {{{timeOfDay}}}
  Day of Week: {{{dayOfWeek}}}
  Patient Acuity: {{{patientAcuity}}}

  Provide a predicted wait time in minutes, a confidence level (high, medium, or low), and a brief rationale for your prediction.
  Make sure that predictedWaitTimeMinutes is a number and confidenceLevel and rationale are strings.
  `,
});

const predictWaitTimeFlow = ai.defineFlow(
  {
    name: 'predictWaitTimeFlow',
    inputSchema: PredictWaitTimeInputSchema,
    outputSchema: PredictWaitTimeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
