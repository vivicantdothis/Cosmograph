import { z } from "zod";

export const planetSchema = z.object({
  number: z.number().min(1).max(100),
  name: z.string(),
  size: z.number(),
  color: z.string(),
  orbitRadius: z.number(),
  orbitSpeed: z.number(),
  description: z.string(),
  explorerQuote: z.string(),
  explorerName: z.string(),
  properties: z.object({
    primeFactors: z.array(z.number()),
    isPrime: z.boolean(),
    isEven: z.boolean(),
    digitSum: z.number(),
    category: z.string(),
  }),
});

export type Planet = z.infer<typeof planetSchema>;
