/* eslint-disable @typescript-eslint/naming-convention */
const TailwindColours = require('tailwindcss/colors');

const production = process.env.NODE_ENV === 'production';
const Colours = {
	transparent: 'transparent',
	current: 'currentColor',
	black: TailwindColours.black,
	white: TailwindColours.white,
	gray: TailwindColours.gray,
	grey: TailwindColours.gray,
	indigo: TailwindColours.indigo,
	red: TailwindColours.rose,
	yellow: TailwindColours.amber,
	cyan: TailwindColours.sky,
	green: TailwindColours.emerald,
	accent: {
		dark: {
			primary: '#ed1c24',
			secondary: '#ed1c2433',
		},
		light: {
			primary: '#ed1c24',
			secondary: '#ed1c2433',
		},
	},
	background: {
		dark: {
			primary: TailwindColours.slate[900],
			secondary: TailwindColours.slate[800],
		},
		light: {
			primary: TailwindColours.slate[100],
			secondary: TailwindColours.slate[200],
		},
	},
	text: {
		dark: {
			primary: TailwindColours.slate[100],
			secondary: TailwindColours.slate[200],
		},
		light: {
			primary: TailwindColours.slate[900],
			secondary: TailwindColours.slate[800],
		},
	},
};

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		colour: Colours,
		colors: Colours,
		boxShadow: {
			sm: '1px 1px 2px 0 rgba(0, 0, 0, 0.05), -1px -1px 2px 0 rgba(255, 255, 255, 0.05)',
			DEFAULT:
				'20px 20px 60px rgba(0, 0, 0, 0.1), -20px -20px 60px rgba(255, 255, 255, 0.1)',
			md: '2px 2px 16px -1px rgba(0, 0, 0, 0.16), -2px -2px 16px -1px rgba(255, 255, 255, 0.16)',
			lg: '5px 5px 25px -3px rgba(0, 0, 0, 0.15), -5px -5px 25px -3px rgba(255, 255, 255, 0.15)',
			xl: '10px 10px 35px -5px rgba(0, 0, 0, 0.14), -10px -10px 35px -5px rgba(255, 255, 255, 0.14)',
			'2xl': '12.5px 12.5px 60px -12px rgba(0, 0, 0, 0.25), -12.5px -12.5px 60px -12px rgba(255, 255, 255, 0.25)',
			'3xl': '17.5px 17.5px 70px -15px rgba(0, 0, 0, 0.3), -17.5px -17.5px 70px -15px rgba(255, 255, 255, 0.3)',
			inner: 'inset 0px 0px 30px 0 rgba(0, 0, 0, 0.3), inset 0px 0px 30px 0 rgba(255, 255, 255, 0.3)',
			none: '0px 0px 0px 0 rgba(0, 0, 0, 0.05), 0px 0px 0px 0 rgba(255, 255, 255, 0.05)',
		},
		fontFamily: {
			display: ['"Darker Grotesque"', 'sans-serif'],
			sans: ['"Space Grotesk"', 'sans-serif'],
		},
		ease: {
			fastSlow: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
			slowSlow: 'cubic-bezier(0.77, 0, 0.175, 1)',
			slowFast: 'cubic-bezier(0.5, 0, 0.75, 0)',
		},
		padding: 'min(12%, 80px)',
		roundness: '0px',
	},
	...(production ? {} : { mode: 'jit' }),
};
