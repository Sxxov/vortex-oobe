import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
// @ts-expect-error
import importAssets from 'rollup-plugin-import-assets';
import { imagetools as viteImagetools } from 'vite-imagetools';
import * as fs from 'fs';
import TailwindConfig from './tailwind.config.cjs';
// @ts-expect-error
import { copy } from 'vite-plugin-copy';
import { URLSearchParams } from 'url';

const PrevaledTailwindConfigExport = Object.entries(TailwindConfig)
	.map(([k, v]) => `export const ${k} = ${JSON.stringify(v)};`)
	.join('\n');
const production = process.env.NODE_ENV === 'production';

export default {
	plugins: [
		{
			name: 'expose tailwind config',
			resolveId(/** @type {string} */ source) {
				return source === '!tw' ? source : null;
			},
			load(/** @type {string} */ id) {
				return id === '!tw' ? PrevaledTailwindConfigExport : null;
			},
		},
		alias({
			entries: [],
		}),
		{
			name: 'named material icons import',
			resolveId(/** @type {string} */ source) {
				return source.startsWith('!i') ? `\0${source}` : null;
			},
			load(/** @type {string} */ id) {
				if (!id.startsWith('\0!i')) return null;

				const [, variant, iconsString] = /\/(.+)::(.+)/.exec(id) ?? [];
				const icons = iconsString.split(',').map((icon) => icon.trim());

				return icons
					.map(
						(icon) =>
							`export { default as ${icon} } from '@material-icons/svg/svg/${icon.replace(
								/^_/,
								'',
							)}/${variant}.svg';`,
					)
					.join('\n');
			},
		},
		importAssets({
			// files to import
			include: [],
			// files to exclude
			exclude: [
				// if doesn't contain '.' or is mjs, mts, js, ts...
				/^((?!\.).)*$|\.(m?[jt]s|json|png|jpg|jpeg|gif|css|html|svg|svelte|pcss|postcss)/i,
			],
			// copy assets to output folder
			emitAssets: true,
			// name pattern for the asset copied
			fileNames: 'assets/_raw/[name]-[hash].[ext]',
			// public path of the assets
			publicPath: '',
		}),
		viteImagetools({
			defaultDirectives: new URLSearchParams({ webp: 'true' }),
		}),
		{
			name: 'svg loader',
			transform(/** @type {string} */ _, /** @type {string} */ path) {
				if (!path.endsWith('.svg')) return null;

				return {
					code: `export default \`${fs.readFileSync(path, 'utf8')}\``,
				};
			},
		},
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		copy([{ src: 'assets/raw/**/*', dest: 'static/raw' }]),
		// commonjs(),
	],
};
