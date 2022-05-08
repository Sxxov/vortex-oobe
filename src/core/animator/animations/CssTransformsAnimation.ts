import { UnimplementedError } from '../../../resources/errors/UnimplementedError';
import { CssAnimation } from './CssAnimation';

export class CssTransformsAnimation extends CssAnimation {
	public declare transformPropertyToValue: Record<
		string,
		(frame: number) => string | number
	>;

	public override readonly property = 'transform';
	public override readonly value = () => {
		throw new UnimplementedError();
	};

	protected override onFrame(frame: number) {
		let transformValue = '';
		// eslint-disable-next-line guard-for-in
		for (const transformProperty in this.transformPropertyToValue) {
			transformValue += `${transformProperty}(${super.toValueString(
				this.transformPropertyToValue[transformProperty](frame),
			)}) `;
		}

		this.elem.style.transform = transformValue;
	}
}
