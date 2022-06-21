import preprocess from 'svelte-preprocess';
import rollupConfig from './rollup.config.js';
import netlify from '@sveltejs/adapter-netlify';

const production = process.env.NODE_ENV === 'production';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [
		preprocess({
			postcss: true,
		}),
	],
	// this is needed for ts <4.7... which isn't released yet
	/** @type {import('@sveltejs/kit').Config['compilerOptions']} */
	compilerOptions: {
		// enable run-time checks when not in production
		dev: !production,
	},
	kit: {
		adapter: netlify(),
		files: {
			template: 'src/app.html',
		},
		vite: {
			plugins: rollupConfig.plugins,
		},
	},
};
