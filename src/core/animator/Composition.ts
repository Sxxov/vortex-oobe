import { set } from '../../resources/decorators/setget';
import { AbstractAnimation } from './animations/AbstractAnimation';

export class Composition extends AbstractAnimation {
	private minIn!: number;
	private maxOut!: number;

	private startedAnimations = new WeakSet<AbstractAnimation>();

	@set<AbstractAnimation[], Composition>(function (v) {
		const onSet = (target: AbstractAnimation[]) => {
			this.minIn = target.reduce(
				(prev, curr) => Math.min(curr['in'], prev),
				0,
			);
			this.maxOut = target.reduce(
				(prev, curr) => Math.max(curr['out'], prev),
				0,
			);
		};

		onSet(v);

		return new Proxy(v, {
			set: (target, name, value: AbstractAnimation) => {
				onSet(target);

				target[name as unknown as number] = value;

				return true;
			},
		});
	})
	public declare animations: AbstractAnimation[];

	@set<number, Composition>(function (v) {
		return v + this.minIn;
	})
	public declare in: number;

	public declare fps;

	public get out() {
		return this.maxOut + this.in;
	}

	public declare readonly length: number;

	public readonly rewind = () => {
		for (let i = 0, l = this.animations.length; i < l; ++i) {
			const animation = this.animations[i];

			animation['onStart']();
			animation['onFrame'](0, this.length);
		}

		this.onFrame(0, this.length);
	};

	protected onStart() {}

	protected onEnd() {}

	protected onCreate() {
		this.animations?.forEach((animation) => {
			animation['onCreate']();
		});
	}

	protected onDestroy() {
		this.animations?.forEach((animation) => {
			animation['onDestroy']();
		});
		this.animations.length = 0;
	}

	protected onFrame(frame: number, length: number) {
		for (let i = 0, l = this.animations.length; i < l; ++i) {
			const animation = this.animations[i];
			const localFrame = frame - animation['in'];
			const fpsAdjustedLocalFrame =
				localFrame * (animation['fps'] / this.fps) + this.in;

			if (!Composition.isFrameWithinRange(frame, animation)) {
				// if delete successful (if animation was present in WeakSet)
				if (this.startedAnimations.delete(animation)) {
					animation['onEnd']();
				}

				continue;
			}

			if (!this.startedAnimations.has(animation)) {
				animation['onStart']();

				this.startedAnimations.add(animation);
			}

			animation['onFrame'](fpsAdjustedLocalFrame, length);
		}
	}

	private static isFrameWithinRange(
		frame: number,
		animation: AbstractAnimation,
	) {
		return frame >= animation['in'] && frame <= animation['out'];
	}
}
