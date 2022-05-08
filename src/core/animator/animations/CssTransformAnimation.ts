import { CssAnimation } from './CssAnimation';

export class CssTransformAnimation extends CssAnimation {
	public declare transformProperty: string;

	public override readonly property = 'transform';

	protected override onStart() {
		super.onStart();

		this.pushStyle('transition', 'none');
	}

	protected override onEnd() {
		super.onEnd();

		this.popStyle('transition');
	}

	protected override onFrame(frame: number) {
		this.elem.style.transform = `${
			this.transformProperty
		}(${super.toValueString(this.value(frame))})`;
	}
}
