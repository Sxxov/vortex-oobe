import { theme } from '!tw';

export class Tailwinder {
	public static injectThemeAsCssVariables() {
		const styles = new Map<string, string | number>();

		(function recurse(o, parentLevel) {
			Object.entries(o).forEach(([k, v]) => {
				const currentLevel = `${parentLevel}-${k}`;

				if (typeof v === 'object') recurse(v, currentLevel);
				else if (k !== 'colors') styles.set(currentLevel, v);
			});
		})(theme, '');

		const css = `:root { ${Array.from(styles.entries())
			.map(
				([k, v]) =>
					`-${this.camelToKebab(k.replace(/\./g, '_'))}: ${v};`,
			)
			.join('\n')} }`;
		const style = document.createElement('style');

		style.appendChild(document.createTextNode(css));

		document.head.appendChild(style);
	}

	private static camelToKebab(string: string) {
		return string
			.split('')
			.map((letter, i) => {
				return /[a-zA-Z]/.test(letter) &&
					letter.toUpperCase() === letter
					? `${i === 0 ? '' : '-'}${letter.toLowerCase()}`
					: letter;
			})
			.join('');
	}

	public static getThemeProp(prop: string): string | number {
		return (
			prop
				.split('.')
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				.reduce((obj, key) => obj[key], theme) as unknown as
				| string
				| number
		);
	}
}
