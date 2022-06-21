import { get, set } from '../../../resources/decorators/setget';
import { Item } from '../../blocks/item';
import type { TItemOptions } from '../../blocks/item';

export abstract class AbstractAnimation extends Item {
	public static noop = <P extends any[], R = void>(..._: P): R => {
		return undefined as unknown as R;
	};

	protected abstract onStart(): void;
	protected abstract onEnd(): void;
	protected abstract onFrame(frame: number, length: number): void;
	protected abstract onCreate(): void;
	protected abstract onDestroy(): void;
	protected abstract in: number;
	protected abstract out: number;
	protected abstract fps: number;

	@get<number, AbstractAnimation>(function () {
		return this.out - this.in;
	})
	@set<number, AbstractAnimation>(function (v) {
		this.out = this.in + v;

		return v;
	})
	protected declare length: number;

	// TODO(sxxov): call destory somewhere
	public readonly destroy = () => {
		this.onDestroy();
	};

	public static override from<T extends typeof Item>(
		this: T,
		// use this adapter type instead of just `InstanceType<T>`
		// to hide protected types & `toString`
		options: TItemOptions<T>,
	): InstanceType<T> {
		const result = super.from(options) as AbstractAnimation;

		result['onCreate']();

		return result as InstanceType<T>;
	}
}
