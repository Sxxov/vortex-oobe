import type { LottiePlayer } from 'lottie-web';
import { IllegalStateError } from '../../../resources/errors';

export class LottieSingleton {
	private static lottie: LottiePlayer;

	public static async loadModule() {
		this.lottie = (await import('lottie-web')).default;
	}

	public static getInstance() {
		if (this.lottie == null) {
			throw new IllegalStateError(
				'Attempted to get lottie instance before the module was loaded (try `.loadModule()`)',
			);
		}

		return this.lottie;
	}
}
