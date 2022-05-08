declare module 'smoothscroll-for-websites' {
	export namespace Smoothscroll {
		interface IOptions {
			animationTime: number;
			stepSize: number;

			accelerationDelta: number;
			accelerationMax: number;

			keyboardSupport: boolean;
			arrowScroll: number;

			/** ratio of "tail" to "acceleration" */
			pulseAlgorithm: boolean;
			pulseScale: number;
			pulseNormalize: number;

			/** ignore touchpad by default */
			touchpadSupport: boolean;
			fixedBackground: boolean;
			excluded: string;
		}
	}

	const Export: {
		(options?: Partial<Smoothscroll.IOptions>): void;
		destroy: () => void;
	};

	export default Export;
}
