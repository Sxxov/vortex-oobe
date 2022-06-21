import { BezierUtility } from '../../../resources/utilities';
import type { Item, TItemOptions } from '../../blocks/item';
import type { AbstractAnimation } from '../animations/AbstractAnimation';
import { AnimationAdapter } from './AnimationAdapter';

export class EasingAdapter extends AnimationAdapter {
	private bezierUtility = new BezierUtility(1, 1, 1, 1);

	public ease(...easing: ConstructorParameters<typeof BezierUtility>) {
		this.bezierUtility = new BezierUtility(...easing);

		return this;
	}

	protected override onFrame(frame: number, length: number) {
		super.onFrame(this.bezierUtility.at(frame / length) * length, length);
	}

	public static override from<
		T extends typeof AbstractAnimation,
		U extends typeof Item = typeof EasingAdapter,
	>(options: TItemOptions<T>): InstanceType<U> {
		return super.from(options);
	}
}
