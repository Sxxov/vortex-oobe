import { Store } from '../../blocks/store';
import { AbstractController } from './AbstractController';

export const enum PlayDirection {
	FORWARDS = 1,
	BACKWARDS = -1,
}

export class FrameController extends AbstractController {
	private rafId: ReturnType<typeof requestAnimationFrame> | null = null;
	private playPromise!: Promise<void>;
	private resolvePlayPromise = () => {};
	private i = this.animator.in;
	public isPausedR = new Store(false);
	private setIsPausedR = this.isPausedR.seal();

	public async play(direction: PlayDirection = PlayDirection.FORWARDS) {
		if (!this.isPausedR.value) {
			this.pause();
		}

		const outFrame = this.animator.out;
		const inFrame = this.animator.in;

		const raf = () => {
			this.animator.seek(this.i);
			this.i += direction;

			if (this.i <= outFrame && this.i >= inFrame) {
				this.rafId = requestAnimationFrame(raf);
			} else {
				this.i = Math.max(Math.min(this.i, outFrame), inFrame);
				cancelAnimationFrame(this.rafId!);
				this.rafId = null;
				this.resolvePlayPromise();
			}
		};

		this.rafId = requestAnimationFrame(raf);

		this.setIsPausedR(false);
		this.playPromise = new Promise<void>((resolve) => {
			this.resolvePlayPromise = resolve;
		});

		return this.playPromise;
	}

	public pause() {
		if (this.rafId == null || this.playPromise == null) {
			return;
		}

		cancelAnimationFrame(this.rafId);

		this.rafId = null;
		this.setIsPausedR(true);

		// await this.playPromise;
		this.resolvePlayPromise();
	}

	public async seek(frame: number, lazy = false) {
		this.i = frame;

		if (lazy) {
			return;
		}

		if (this.rafId == null) {
			this.animator.seek(this.i);

			return;
		}

		return new Promise<void>((resolve) => {
			requestAnimationFrame(() => {
				resolve();
			});
		});
	}

	public async loop(direction: PlayDirection = PlayDirection.FORWARDS) {
		while (!this.isPausedR.value) {
			await this.play(direction);
		}
	}

	public destroy() {
		this.pause();
	}
}
