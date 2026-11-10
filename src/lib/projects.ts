import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Area = NonNullable<Project['data']['areas']>[number];

/** Nombre visible de cada producto que está dividido en varias piezas. */
const PRODUCT_NAMES: Record<string, string> = {
	'ant-simulator': 'Simulador ANT Ecuador',
	arrechoteca: 'La Caleta del Verbo',
	marknotes: 'MarkNotes',
	ube: 'UBE Assistant',
};

/** Orden en que se muestran las piezas: primero lo que el usuario ve. */
const PART_ORDER = ['web', 'chatbot', 'app', 'admin', 'backend'];
const partRank = (p: Project) => {
	const part = (p.data.part ?? '').toLowerCase();
	const i = PART_ORDER.findIndex((k) => part.startsWith(k));
	return i === -1 ? PART_ORDER.length : i;
};

export interface ProjectGroup {
	key: string;
	title: string;
	/** Pieza que representa al grupo en la tarjeta (enlace, descripción, demo). */
	primary: Project;
	/** Todas las piezas, en orden de lectura. Un proyecto simple tiene una sola. */
	parts: Project[];
	image: string | undefined;
	areas: Area[];
	technologies: string[];
	featured: boolean;
	order: number;
	kind: Project['data']['kind'];
}

const byPriority = (a: ProjectGroup, b: ProjectGroup) => {
	if (a.featured !== b.featured) return a.featured ? -1 : 1;
	if (a.order !== b.order) return a.order - b.order;
	return a.title.localeCompare(b.title, 'es');
};

export async function getProjectGroups(): Promise<ProjectGroup[]> {
	const all = await getCollection('projects');
	const buckets = new Map<string, Project[]>();
	for (const p of all) {
		const key = p.data.product ?? p.slug;
		buckets.set(key, [...(buckets.get(key) ?? []), p]);
	}

	const groups = [...buckets.entries()].map(([key, items]): ProjectGroup => {
		const parts = [...items].sort((a, b) => partRank(a) - partRank(b));
		// La tarjeta usa la primera pieza con imágenes para no mostrar un hueco.
		const primary = parts.find((p) => p.data.images.length > 0) ?? parts[0];
		const multi = parts.length > 1;
		return {
			key,
			title: multi ? PRODUCT_NAMES[key] ?? primary.data.title : primary.data.title,
			primary,
			parts,
			image: primary.data.images[0],
			areas: [...new Set(parts.flatMap((p) => p.data.areas ?? []))],
			technologies: [...new Set(parts.flatMap((p) => p.data.technologies.map(shortTech)))],
			featured: parts.some((p) => p.data.featured),
			order: Math.min(...parts.map((p) => p.data.order ?? Number.MAX_SAFE_INTEGER)),
			kind: primary.data.kind,
		};
	});

	return groups.sort(byPriority);
}

export function findGroup(groups: ProjectGroup[], slug: string) {
	return groups.find((g) => g.parts.some((p) => p.slug === slug));
}

/** Variantes del mismo nombre escritas distinto en los archivos. */
const TECH_ALIASES: Record<string, string> = {
	Html: 'HTML',
	HTML5: 'HTML',
	Javascript: 'JavaScript',
	NextJS: 'Next.js',
	TailwindCSS: 'Tailwind',
	'Tailwind CSS': 'Tailwind',
	FastApi: 'FastAPI',
	Shadcn: 'shadcn/ui',
	Langchain: 'LangChain',
};

/** "SQLAlchemy (ORM)" → "SQLAlchemy". Lo de los paréntesis queda en el detalle. */
export function shortTech(name: string) {
	const short = name.replace(/\s*\(.*?\)\s*/g, '').trim();
	return TECH_ALIASES[short] ?? short;
}

/** Categorías del detalle, en el orden en que se muestran. */
const TECH_CATEGORIES: { label: string; items: string[] }[] = [
	{ label: 'Lenguajes', items: ['TypeScript', 'JavaScript', 'Python', 'Kotlin', 'HTML', 'CSS', 'Markdown'] },
	{
		label: 'Frontend',
		items: ['Astro', 'React', 'Next.js', 'Svelte', 'SvelteKit', 'Tailwind', 'shadcn/ui', 'shadcn-svelte', 'GSAP', 'Lenis', 'Phosphor Icons', 'VTEX IO'],
	},
	{
		label: 'Mobile',
		items: ['Kotlin Multiplatform', 'Jetpack Compose', 'Material3', 'Ktor', 'Koin', 'React Native', 'Expo'],
	},
	{
		label: 'Backend',
		items: [
			'NestJS', 'Fastify', 'FastAPI', 'Django', 'Django Rest Framework', 'Prisma', 'SQLAlchemy', 'Alembic',
			'PostgreSQL', 'Redis', 'BullMQ', 'Supabase', 'JWT', 'OAuth', 'Google OAuth', 'Swagger', 'Redoc',
			'python-dotenv', 'Resend', 'WhatsApp Business API', 'Paddle', 'Payoneer', 'Cloudinary', 'S3',
		],
	},
	{ label: 'IA', items: ['LangChain', 'LangGraph', 'RAG', 'pgvector', 'MiniMax', 'Gemini Embeddings'] },
	{
		label: 'Infraestructura',
		items: ['Docker', 'Dockploy', 'Nginx', 'VPS', 'Vercel', 'Railway', 'Github Pages', 'Play Console', 'Xcode', 'Turborepo', 'Git & GitHub'],
	},
];

/**
 * Agrupa las tecnologías por categoría para el detalle. Conserva el nombre
 * completo ("SQLAlchemy (ORM)") y deja lo que no esté mapeado en "Otras".
 */
export function groupTechnologies(technologies: string[]) {
	const seen = new Set<string>();
	const buckets = new Map<string, string[]>();
	for (const tech of technologies) {
		const key = shortTech(tech);
		if (seen.has(key)) continue;
		seen.add(key);
		const category = TECH_CATEGORIES.find((c) => c.items.includes(key))?.label ?? 'Otras';
		buckets.set(category, [...(buckets.get(category) ?? []), TECH_ALIASES[tech] ?? tech]);
	}
	return [...TECH_CATEGORIES.map((c) => c.label), 'Otras']
		.filter((label) => buckets.has(label))
		.map((label) => ({ label, items: buckets.get(label)! }));
}

/** Filtros visibles. Cada uno junta una o más áreas del schema. */
export const FILTERS: { id: string; label: string; areas: Area[] }[] = [
	{ id: 'fullstack', label: 'Productos fullstack', areas: ['fullstack'] },
	{ id: 'web', label: 'Web y landings', areas: ['frontend', 'landing', 'admin'] },
	{ id: 'mobile', label: 'Mobile', areas: ['mobile'] },
	{ id: 'backend', label: 'Backend / APIs', areas: ['backend'] },
	{ id: 'ia', label: 'IA', areas: ['ia'] },
];

/** Enlaces viejos (?filter=frontend) siguen funcionando. */
export const LEGACY_FILTERS: Record<string, string> = {
	frontend: 'web',
	landing: 'web',
	admin: 'web',
};

export function groupFilters(group: ProjectGroup) {
	return FILTERS.filter((f) => f.areas.some((a) => group.areas.includes(a))).map((f) => f.id);
}

/** Texto e ícono del enlace "demo" según a dónde lleva de verdad. */
export function demoLink(url: string, areas: Area[] = []) {
	if (/play\.google\.com/.test(url)) return { label: 'Play Store', icon: 'simple-icons:googleplay' };
	if (/apps\.apple\.com/.test(url)) return { label: 'App Store', icon: 'simple-icons:appstore' };
	if (/\/docs\/?$/.test(url)) return { label: 'API Docs', icon: 'ph:code' };
	if (areas.length > 0 && areas.every((a) => a === 'backend' || a === 'ia')) return { label: 'Ver API', icon: 'ph:code' };
	return { label: 'Ver sitio', icon: 'ph:arrow-square-out' };
}

export const KIND_LABEL = { propio: 'Proyecto personal', freelance: 'Freelance', laboral: 'Proyecto laboral' } as const;
const STATUS_LABEL = { produccion: 'En producción', desarrollo: 'En desarrollo', archivado: 'Archivado' } as const;

/** Línea de contexto: "Cliente · 2025 · En producción". Solo lo que esté cargado. */
export function metaLine(p: Project) {
	const { kind, year, status } = p.data;
	return [kind && KIND_LABEL[kind], year, status && STATUS_LABEL[status]].filter(Boolean).join(' · ');
}

/** Ícono representativo para el placeholder de proyectos sin capturas. */
export function placeholderIcon(areas: Area[]) {
	if (areas.includes('mobile')) return 'ph:device-mobile';
	if (areas.includes('ia')) return 'ph:sparkle';
	if (areas.includes('backend') && !areas.includes('frontend')) return 'ph:database';
	return 'ph:browser';
}

/** Tono estable por proyecto para que cada placeholder se vea distinto. */
export function placeholderHue(key: string) {
	let h = 0;
	for (const c of key) h = (h * 31 + c.charCodeAt(0)) % 360;
	return h;
}
