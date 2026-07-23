import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    images: z.array(z.string()),
    areas: z.array(z.enum(['backend', 'frontend', 'mobile', 'fullstack', 'ia', 'landing', 'admin'])).optional(),
    featured: z.boolean().default(false),
    /** Menor número = más arriba. Featured se listan antes que el resto. */
    order: z.number().optional(),
    previewLink: z.union([z.string().url(), z.literal('')]),
    githubLink: z.union([z.string().url(), z.literal('')]),
    features: z.array(z.string()).optional(),
  }),
});

export const collections = { projects };
