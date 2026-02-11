import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    images: z.array(z.string()),
    areas: z.array(z.enum(['backend', 'frontend', 'app', 'fullstack'])).optional(),
    featured: z.boolean().default(false),
    previewLink: z.union([z.string().url(), z.literal('')]),
    githubLink: z.union([z.string().url(), z.literal('')]),
    features: z.array(z.string()).optional(),
  }),
});

export const collections = { projects };
