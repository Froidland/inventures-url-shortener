import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'dark-gray': {
					100: '#161616',
					200: '#1c1c1c',
					300: '#232323',
					400: '#282828',
					500: '#2e2e2e',
					600: '#343434',
					700: '#3e3e3e',
					800: '#505050',
					900: '#707070',
					1000: '#7e7e7e',
					1100: '#a0a0a0',
					1200: '#ededed'
				},
				'light-gray': {
					100: '#fcfcfc',
					200: '#f8f8f8',
					300: '#f3f3f3',
					400: '#ededed',
					500: '#e8e8e8',
					600: '#e2e2e2',
					700: '#dbdbdb',
					800: '#c7c7c7',
					900: '#8f8f8f',
					1000: '#858585',
					1100: '#6f6f6f',
					1200: '#171717'
				}
			}
		}
	}
} satisfies Config;
