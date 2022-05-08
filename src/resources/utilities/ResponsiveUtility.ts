import { Store } from '../../core/blocks/store';

export enum ResponsiveDevice {
	MOBILE = 'mobile',
	TABLET = 'tablet',
	POTATO = 'potato',
	DESKTOP = 'desktop',
}

export enum ResponsiveBreakpoint {
	MOBILE = 0,
	TABLET = 560,
	POTATO = 1024,
	DESKTOP = 1280,
}

export class ResponsiveUtility {
	private static nodes: Element[] = [];
	public static isListenerActive = false;
	public static currentBreakpointKeyR = new Store<
		keyof typeof ResponsiveBreakpoint
	>('DESKTOP');

	public static currentBreakpointR = new Store<ResponsiveBreakpoint>(
		ResponsiveBreakpoint.DESKTOP,
	);

	private static setCurrentBreakpointKeyR = this.currentBreakpointKeyR.seal();
	private static setCurrentBreakpointR = this.currentBreakpointR.seal();

	public static apply(node: HTMLBaseElement): void {
		this.nodes.push(node);

		this.refresh(this.nodes.length - 1);
	}

	private static refresh(index?: number): void {
		const nodesToRefresh = (() => {
			if (index) {
				return [this.nodes[index]];
			}

			return this.nodes;
		})();

		nodesToRefresh.forEach((node) => {
			this.setCurrentBreakpointClass(node);
		});
	}

	private static setCurrentBreakpointClass(node: Element): void {
		this.setClass(ResponsiveDevice[this.currentBreakpointKeyR.value], node);
	}

	private static setClass(className: ResponsiveDevice, node: Element): void {
		node.classList.remove(...Object.values(ResponsiveDevice));
		node.classList.add(className);
	}

	public static onResize(): void {
		let result!: ResponsiveBreakpoint;

		Object.keys(ResponsiveBreakpoint).forEach(
			(responsiveBreakpoint: unknown) => {
				// is not number/is left side of ResponsiveBreakpoint
				if (Number.isNaN(Number(responsiveBreakpoint))) {
					return;
				}

				if (
					window.innerWidth >
					(responsiveBreakpoint as ResponsiveBreakpoint)
				) {
					result = responsiveBreakpoint as ResponsiveBreakpoint;
				}
			},
		);

		if (result === this.currentBreakpointR.value) {
			return;
		}

		this.setCurrentBreakpointKeyR(
			ResponsiveBreakpoint[result] as keyof typeof ResponsiveBreakpoint,
		);
		this.setCurrentBreakpointR(result);
		this.refresh();
	}
}

if (
	typeof window !== String(undefined) &&
	!ResponsiveUtility.isListenerActive
) {
	ResponsiveUtility.onResize();
	window.addEventListener(
		'resize',
		ResponsiveUtility.onResize.bind(ResponsiveUtility),
	);

	ResponsiveUtility.isListenerActive = true;
}
