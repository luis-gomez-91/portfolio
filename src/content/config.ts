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
    /** Agrupa piezas del mismo producto (backend, app, admin) para contarlas una sola vez. */
    product: z.string().optional(),
    /** Nombre corto de la pieza dentro del producto: "Backend", "App", "Admin"… */
    part: z.string().optional(),
    /** Origen: proyecto personal, freelance para un cliente o hecho en un empleo. */
    kind: z.enum(['propio', 'freelance', 'laboral']).optional(),
    year: z.number().int().optional(),
    status: z.enum(['produccion', 'desarrollo', 'archivado']).optional(),
    previewLink: z.union([z.string().url(), z.literal('')]),
    githubLink: z.union([z.string().url(), z.literal('')]),
    features: z.array(z.string()).optional(),
  }),
});

export const collections = { projects };
