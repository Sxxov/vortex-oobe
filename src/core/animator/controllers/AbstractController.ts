import type { Animator } from '../Animator';

export abstract class AbstractController {
	constructor(protected animator: Animator) {}

	public abstract destroy(): void;
}
