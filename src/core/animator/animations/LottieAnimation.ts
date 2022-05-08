import type {
	AnimationConfigWithData,
	AnimationConfigWithPath,
	AnimationItem,
	AnimationRenderer,
} from 'lottie-web';
import { set } from '../../../resources/decorators/setget';
import { LottieSingleton } from '../singletons/LottieSingleton';
import { AbstractElementAnimation } from './AbstractElementAnimation';

class LottieConfigOverride {
	public loop = false;
	public autoplay = false;
}
type TLottieConfig<T extends AnimationRenderer> = Exclude<
	AnimationConfigWithData<T> | AnimationConfigWithPath<T>,
	keyof LottieConfigOverride
>;

export class LottieAnimation extends AbstractElementAnimation {
	private resizeObserver = new ResizeObserver((entries) => {
		entries.forEach((entry) => {
			this.onResize(entry);
		});
	});

	private lottie = LottieSingleton.getInstance();
	private lottieItem!: AnimationItem;

	public declare in: number;
	public respectDevicePixelRatio? = true;

	@set<TLottieConfig<'canvas'>, LottieAnimation>(function (v) {
		this.lottieItem = this.lottie.loadAnimation({
			...v,
			...new LottieConfigOverride(),
		});
		this.elem = v.container as HTMLElement;

		return v;
	})
	public declare lottieConfig: TLottieConfig<'canvas'>;

	public get out() {
		return this.lottieItem.totalFrames;
	}

	public get fps() {
		return this.lottieItem.frameRate;
	}

	protected onResize(_entry: ResizeObserverEntry) {
		this.lottieItem.resize();
	}

	protected override onStart(): void {
		super.onStart();

		// the onResize is immediately called once when we call observe
		this.resizeObserver.observe(this.elem);
	}

	protected override onEnd(): void {
		// unobserve before calling super.onEnd to prevent extraneous relayouts
		this.resizeObserver.unobserve(this.elem);

		super.onEnd();
	}

	protected onFrame(frame: number): void {
		this.lottieItem.goToAndStop(frame);
	}
}
