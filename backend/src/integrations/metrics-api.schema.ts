import { z } from 'zod';

export const metricsServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.object({
    region_code: z.string(),
    country: z.string(),
    region: z.string(),
    city: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  metrics_path: z.string(),
});

export const servicesResponseSchema = z.array(metricsServiceSchema);

export type MetricsService = z.infer<typeof metricsServiceSchema>;
