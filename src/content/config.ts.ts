import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    images: z.array(z.string()),
    previewLink: z.string().url(),
    githubLink: z.string().url(),
  }),
});

export const collections = { projects };
