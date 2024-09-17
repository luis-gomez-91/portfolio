/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			width: {
				'540': '540px',
			},
			backgroundImage: {
				'prueba': "url('public/img/prueba.png')",
			},
			boxShadow: {
				'3xl': '5px 5px 10px 0px rgba(0,0,0,0.15)',
			}
		},
	},
	plugins: [
		require('tailwindcss-animated')
	],
}
