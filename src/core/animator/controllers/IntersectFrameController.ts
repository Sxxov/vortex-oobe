import { SleepUtility, WalkUtility } from '../../../resources/utilities';
import { Store } from '../../blocks/store';
import type { Animator } from '../Animator';
import { FrameController, PlayDirection } from './FrameController';

export class IntersectFrameController extends FrameController {
	private intersectionObserver: IntersectionObserver;
	private mutationObserver: MutationObserver;
	private isIntersectingTargets = new Set();
	private isIntersecting = new Store(false);

	constructor(
		animator: Animator,
		private elem: HTMLElement,
		private delay = 0,
		private direction = PlayDirection.FORWARDS,
	) {
		super(animator);

		this.intersectionObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					this.isIntersectingTargets.add(entry.target);
				} else {
					this.isIntersectingTargets.delete(entry.target);
				}
			});
			this.isIntersecting.set(this.isIntersectingTargets.size > 0);
		});
		this.mutationObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node instanceof Element) {
						this.intersectionObserver.observe(node);
					}
				});
				mutation.removedNodes.forEach((node) => {
					if (node instanceof Element) {
						this.intersectionObserver.unobserve(node);
					}
				});
			});
		});
		this.isIntersecting.subscribe((isIntersecting) => {
			if (isIntersecting) {
				void this.onIntersect();
			} else {
				void this.onUnintersect();
			}
		});

		WalkUtility.walkAlongChildren(this.elem, 'childNodes', (node) => {
			if (node instanceof HTMLElement) {
				const { height, width } = node.getBoundingClientRect();

				if (height !== 0 && width !== 0) {
					this.intersectionObserver.observe(node);

					if (node.parentElement) {
						this.mutationObserver.observe(node.parentElement, {
							childList: true,
						});
					}

					return false;
				}
			}

			return true;
		});
	}

	private async onIntersect() {
		this.animator.composition.rewind();
		await this.seek(0);
		await SleepUtility.sleep(this.delay);
		await this.play(this.direction);
	}

	private async onUnintersect() {
		await this.pause();
		this.animator.composition.rewind();
		await this.seek(0);
	}

	public override destroy() {
		this.mutationObserver.disconnect();
		this.intersectionObserver.disconnect();

		super.destroy();
	}
}
