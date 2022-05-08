import type { Animator } from '../Animator';
import type { AnimationAdapter } from '../adapters/AnimationAdapter';
import type { AbstractAnimation } from '../animations/AbstractAnimation';

export class AdaptedAnimator implements Animator {
	constructor(
		private animator: Animator,
		private adapt: (animation: AbstractAnimation) => AnimationAdapter,
	) {}

	public get composition() {
		return this.animator.composition;
	}

	public get in() {
		return this.animator.in;
	}

	public get out() {
		return this.animator.out;
	}

	public add(animation: AbstractAnimation): number {
		return this.animator.add(this.adapt(animation));
	}

	public seek(frame: number): void {
		this.animator.seek(frame);
	}
}
