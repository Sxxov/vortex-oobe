import { Tailwinder } from '../../core/tailwinder/Tailwinder';
import { IncorrectUsageError, UnexpectedValueError } from '../errors';
import { WindowUtility } from './WindowUtility';
// eslint-disable-next-line @typescript-eslint/naming-convention
export type Css = string | number;

export class CssUtility {
	public static parse(value: Css): string {
		switch (true) {
			case value === '':
				return value as string;
			case value == null:
				return '0px';
			case typeof value === 'number':
				return `${value}px`;
			case (value as string).startsWith('--'):
				return `var(${value})`;
			case (value as string).startsWith('.'):
				return String(Tailwinder.getThemeProp(value as string));
			case this.isNumber(value):
				return `${value}px`;
			default:
				return value as string;
		}
	}

	public static unparse(value: string, ctx?: HTMLElement): number {
		switch (true) {
			case value == null:
				return 0;
			case this.isNumber(value):
				return Number(value);
			case value.endsWith('%'):
				this.assertCtx(ctx);

				return ctx.clientWidth * (Number.parseFloat(value) / 100);
			case this.isSingularValue(value, 'px'):
				return Number.parseFloat(value);
			case this.isSingularValue(value, 'vh'):
				return WindowUtility.viewport.height;
			case this.isSingularValue(value, 'vw'):
				return WindowUtility.viewport.width;
			case this.isSingularValue(value, 'vmax'):
				return Math.max(
					WindowUtility.viewport.height,
					WindowUtility.viewport.width,
				);
			case this.isSingularValue(value, 'vmin'):
				return Math.min(
					WindowUtility.viewport.height,
					WindowUtility.viewport.width,
				);
			case value.startsWith('var(--'):
				this.assertCtx(ctx);

				return Number(this.getVariable(value, ctx));
			default:
				this.assertCtx(ctx);

				return this.getComputed(value, ctx);
		}
	}

	public static getVariable(
		variable: string,
		ctx: HTMLElement = document.documentElement,
	): string {
		return getComputedStyle(ctx)
			.getPropertyValue(variable.replace(/^var\(/, '').replace(/\)$/, ''))
			.trim();
	}

	public static isSingularValue(value: string, suffix: string): boolean {
		return this.isNumber(value.replace(suffix, ''));
	}

	public static getComputed(value: string, ctx: HTMLElement): number {
		// @ts-expect-error use fake css prop to compute value
		ctx.style.x = value;

		// @ts-expect-error use fake css prop to compute value
		const result = Number.parseFloat(getComputedStyle(ctx).x);

		// @ts-expect-error use fake css prop to compute value
		delete ctx.style.x;

		if (Number.isNaN(result)) {
			throw new UnexpectedValueError('result === NaN');
		}

		return result;
	}

	private static assertCtx(ctx: HTMLElement | undefined): asserts ctx {
		if (ctx != null) {
			return;
		}

		throw new IncorrectUsageError(`ctx === ${String(ctx)}`);
	}

	public static isNumber(value: unknown): boolean {
		return !Number.isNaN(Number(value));
	}
}
