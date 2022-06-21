import type { Item, TItemOptions } from '../../blocks/item';
import { AbstractAnimation } from '../animations/AbstractAnimation';

export class AnimationAdapter<
	T extends AbstractAnimation = AbstractAnimation,
> extends AbstractAnimation {
	protected declare animation: T;
	protected get in() {
		return this.animation['in'];
	}

	protected get out() {
		return this.animation['out'];
	}

	protected get fps() {
		return this.animation['fps'];
	}

	protected onStart(): void {
		this.animation['onStart']();
	}

	protected onEnd(): void {
		this.animation['onEnd']();
	}

	protected onFrame(frame: number, length: number): void {
		this.animation['onFrame'](frame, length);
	}

	protected onCreate(): void {
		this.animation['onCreate']();
	}

	protected onDestroy(): void {
		this.animation['onDestroy']();
	}

	public static override from<
		T extends typeof AbstractAnimation,
		U extends typeof Item = typeof AnimationAdapter,
	>(options: TItemOptions<T>): InstanceType<U> {
		const instance = new this();

		instance.animation = options as unknown as AbstractAnimation;

		return instance as InstanceType<U>;
	}
}
