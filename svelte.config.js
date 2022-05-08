import preprocess from 'svelte-preprocess';
import rollupConfig from './rollup.config.js';
import netlify from '@sveltejs/adapter-netlify';

const production = process.env.NODE_ENV === 'production';
const nameToHashes = new Map();

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

		cssHash: ({ hash: hasher, css, name }) => {
			const hash = hasher(css);

			if (production) {
				return `_${hash}`;
			}

			let hashes = nameToHashes.get(name);

			if (hashes == null) {
				/** @type {string[]} */
				const arr = [];
				nameToHashes.set(name, arr);
				hashes = arr;
			}

			let index = hashes.indexOf(hash);

			if (index === -1) {
				index = hashes.push(hash) - 1;
			}

			return `<${name}${index ? `-${index}` : ''}>`;
		},
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
