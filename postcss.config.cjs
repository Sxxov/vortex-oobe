/* eslint-disable @typescript-eslint/naming-convention */
const postcssImport = require('postcss-import');
// @ts-expect-error
const postcssImportUrl = require('postcss-import-url');
const tailwindcssNesting = require('tailwindcss/nesting');
const fs = require('fs');
const pathTool = require('path');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const { postcssFontGrabber } = require('postcss-font-grabber');

const mode = process.env.NODE_ENV;
const production = mode !== 'development';

module.exports = {
	/** @type {import('postcss').Plugin[]} */
	plugins: [
		{
			postcssPlugin: "escape <>'s in svelte class names",
			Rule(rule) {
				rule.selector = rule.selector.replace(
					/(<)(\w+?)(>)/g,
					'\\$1$2\\$3',
				);
			},
		},
		postcssImport(),
		postcssFontGrabber({
			cssDest: '.',
			fontDest: 'static/_app/assets/_webfonts',
		}),
		{
			postcssPlugin: 'remove "static" from postcss-font-grabber result',
			AtRule(rule) {
				if (rule.name !== 'font-face') return;
				for (const node of rule.nodes) {
					if (!(node.type === 'decl' && node.prop === 'src')) {
						continue;
					}

					node.value = node.value.replace(/\(static/g, '(');
				}
			},
		},
		{
			postcssPlugin: 'copy fonts to assets',
			AtRule(rule) {
				if (rule.name !== 'font-face') return;
				for (const node of rule.nodes) {
					if (!(node.type === 'decl' && node.prop === 'src')) {
						continue;
					}

					const [matched, src] =
						/url\((.+?)\)/.exec(node.value) ?? [];

					if (
						src.startsWith('/_app') ||
						src.startsWith('__VITE_ASSET__')
					)
						continue;

					const dest = `/_app${src.replace(/^\/src/, '')}`;

					fs.mkdirSync(
						pathTool.dirname(`${__dirname}/static${dest}`),
						{
							recursive: true,
						},
					);
					fs.copyFileSync(
						`${__dirname}${src}`,
						`${__dirname}/static${dest}`,
					);

					node.value = `url(${dest})${node.value.substring(
						matched.length,
					)}`;
				}
			},
		},
		// write plugin to copy all srcs to assets
		postcssImportUrl({
			modernBrowser: true,
		}),
		tailwindcssNesting(),
		tailwindcss(),
		autoprefixer(),
		production &&
			cssnano({
				preset: 'default',
			}),
	],
};
