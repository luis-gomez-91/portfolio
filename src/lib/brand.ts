import * as simpleIcons from 'simple-icons';

type SimpleIcon = { slug: string; hex: string };

const bySlug = new Map<string, SimpleIcon>();
for (const value of Object.values(simpleIcons) as unknown[]) {
	if (value && typeof value === 'object' && 'slug' in value && 'hex' in value) {
		const icon = value as SimpleIcon;
		bySlug.set(icon.slug, icon);
	}
}

/**
 * Color oficial de una marca de Simple Icons, o null si es demasiado claro
 * para leerse sobre las tarjetas claras (en ese caso se usa el color del texto).
 */
export function brandColor(iconName: string): string | null {
	if (!iconName.startsWith('simple-icons:')) return null;
	const icon = bySlug.get(iconName.slice('simple-icons:'.length));
	if (!icon) return null;
	const [r, g, b] = [0, 2, 4].map((i) => parseInt(icon.hex.slice(i, i + 2), 16) / 255);
	const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
	const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
	return luminance > 0.45 ? null : `#${icon.hex}`;
}
