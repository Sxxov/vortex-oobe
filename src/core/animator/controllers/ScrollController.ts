import type { Animator } from '../Animator';
import { AbstractController } from './AbstractController';

export const enum ScrollAxis {
	X = 'x',
	Y = 'y',
}

export class ScrollController extends AbstractController {
	private onScroll = () => {
		this.animator.seek(
			(window[this.axis === ScrollAxis.X ? 'scrollX' : 'scrollY'] /
				window[
					this.axis === ScrollAxis.X ? 'innerWidth' : 'innerHeight'
				]) *
				this.framesPerViewport,
		);
	};

	constructor(
		animator: Animator,
		private framesPerViewport = animator.composition.fps,
		private axis = ScrollAxis.Y,
	) {
		super(animator);

		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', this.onScroll);

			this.onScroll();
		}
	}

	public destroy() {
		if (typeof window !== 'undefined')
			window.removeEventListener('scroll', this.onScroll);
	}
}
