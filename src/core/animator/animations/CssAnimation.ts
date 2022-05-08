import { AbstractElementAnimation } from './AbstractElementAnimation';

export class CssAnimation extends AbstractElementAnimation {
	public declare in: number;
	protected declare out: number;
	public declare length: number;
	public declare elem: HTMLElement;
	public declare property: string;
	public declare value: (frame: number) => number | string;

	protected readonly fps = 60;

	protected onFrame(frame: number): void {
		// @ts-expect-error obj[string]
		this.elem.style[this.property] = this.toValueString(this.value(frame));
	}

	protected toValueString(value: number | string) {
		if (typeof value === 'number') {
			return String(value) + 'px';
		}

		return value;
	}
}
