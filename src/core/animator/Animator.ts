import { Composition } from './Composition';
import type { AbstractAnimation } from './animations/AbstractAnimation';

export class Animator {
	public composition = Composition.from({
		animations: [],
		in: 0,
		fps: 60,
	});

	public get in() {
		return this.composition.in;
	}

	public get out() {
		return this.composition.out;
	}

	public add(animation: AbstractAnimation) {
		return this.composition.animations.push(animation);
	}

	public seek(frame: number) {
		this.composition['onFrame'](frame, this.composition.length);
	}
}
