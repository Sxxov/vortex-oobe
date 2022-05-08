export class WindowUtility {
	private static cache: {
		inner?: typeof WindowUtility['inner'];
		viewport?: typeof WindowUtility['viewport'];
		client?: typeof WindowUtility['client'];
		isMobile?: boolean;
	} = {};

	public static invalidateCache(): void {
		this.cache = {};
	}

	public static refresh(): void {
		this.invalidateCache();

		this.cache = {
			inner: this.inner,
			viewport: this.viewport,
			client: this.client,
			isMobile: this.isMobile,
		};
	}

	public static vh(amount: number): number {
		return (this.viewport.height / 100) * amount;
	}

	public static vw(amount: number): number {
		return (this.viewport.width / 100) * amount;
	}

	public static px(amount: number): number {
		return amount * window.devicePixelRatio;
	}

	static get client(): {
		height: number;
		width: number;
		min: number;
		max: number;
	} {
		if (this.cache?.client?.height || this.cache?.client?.width) {
			return this.cache.client;
		}

		this.cache.client = {
			height: document.documentElement.clientHeight,
			width: document.documentElement.clientWidth,
			max: Math.max(
				document.documentElement.clientHeight,
				document.documentElement.clientWidth,
			),
			min: Math.min(
				document.documentElement.clientHeight,
				document.documentElement.clientWidth,
			),
		};

		return this.cache.client;
	}

	static get inner(): {
		height: number;
		width: number;
		min: number;
		max: number;
	} {
		if (this.cache?.inner?.height || this.cache?.inner?.width) {
			return this.cache.inner;
		}

		this.cache.inner = {
			height: window.innerHeight,
			width: window.innerWidth,
			max: Math.max(window.innerHeight, window.innerWidth),
			min: Math.min(window.innerHeight, window.innerWidth),
		};

		return this.cache.inner;
	}

	static get viewport(): {
		height: number;
		width: number;
		min: number;
		max: number;
	} {
		if (this.cache?.viewport?.height || this.cache?.viewport?.width) {
			return this.cache.viewport;
		}

		const viewportCalibrator = document.createElement('div');

		viewportCalibrator.style.height = '100vh';
		viewportCalibrator.style.width = '100vw';
		viewportCalibrator.style.visibility = 'hidden';

		document.body.appendChild(viewportCalibrator);

		const height = viewportCalibrator.offsetHeight;
		const width = viewportCalibrator.offsetWidth;

		document.body.removeChild(viewportCalibrator);

		this.cache.viewport = {
			height,
			width,
			max: Math.max(height, width),
			min: Math.min(height, width),
		};

		return this.cache.viewport;
	}

	static get isMobile(): boolean {
		if (this.cache?.isMobile) {
			return this.cache.isMobile;
		}

		const isMobile =
			window.matchMedia('(pointer: coarse)').matches ||
			window.matchMedia('(pointer: cnone)').matches;

		this.cache.isMobile = isMobile;

		return isMobile;
	}
}

if (typeof window !== String(undefined)) {
	window.addEventListener('resize', () => {
		WindowUtility.refresh();
	});
}
