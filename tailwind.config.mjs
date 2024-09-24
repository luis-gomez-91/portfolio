/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./node_modules/flowbite/**/*.js'
	],
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
			},
			colors: {
				primary: {
					light: '#415f91',
					dark: '#aac7ff',
				},
				secondary: {
					light: '#565f71',
					dark: '#bec6dc',
				},
				tertiary: {
					light: '#79590c',
					dark: '#ebc16c',
				},
				primaryContainer: {
					light: '#d6e3ff',
					dark: '#284777',
				},
				secondaryContainer: {
					light: '#dae2f9',
					dark: '#3e4759',
				},
				tertiaryContainer: {
					light: '#ffdea3',
					dark: '#5d4200',
				},
				surface: {
					light: '#f9f9ff',
					dark: '#111318',
				},
				surfaceContainer: {
					light: '#ededf4',
					dark: '#1d2024',
				},
				onSurface: {
					light: '#191c20',
					dark: '#e2e2e9',
				},
				danger: {
					light: '#ba1a1a',
					dark: '#ffb4ab',
				},
				dangerContainer: {
					light: '#ffdad6',
					dark: '#93000a',
				},
				outline: {
					light: '#74777f',
					dark: '#8e9099',
				},
			},
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
				suse: ['SUSE', 'sans-serif']
			},
		},
	},
	plugins: [
		require('tailwindcss-animated'),
        require('flowbite/plugin'),
	],
	
}

// module.exports = {
// 	content: [
// 		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
// 		'./node_modules/flowbite/**/*.js'
// 	],
// 	theme: {
// 		extend: {},
// 	},
// 	plugins: [
// 		require('flowbite/plugin')
// 	],
// }
