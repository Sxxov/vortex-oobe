import { UnreachableError } from '../../../resources/errors';
import { AbstractAnimation } from './AbstractAnimation';

export const enum WhenNotAnimatingBehaviour {
	HIDE = 'hide',
	SHOW = 'show',
	HIDE_PRESERVE_LAYOUT = 'invisible',
}

type TNonReadonlyCssStyleDeclaration = Exclude<
	keyof CSSStyleDeclaration,
	'length' | 'parentRule'
>;

export abstract class AbstractElementAnimation extends AbstractAnimation {
	public declare elem: HTMLElement;
	public whenNotAnimating?:
		| WhenNotAnimatingBehaviour
		| `${WhenNotAnimatingBehaviour}`
		| undefined = WhenNotAnimatingBehaviour.SHOW;

	private originalStyleMap = new Map<string, string[]>();

	protected onCreate() {
		this.onEnd();
	}

	protected onDestroy() {
		this.onEnd();
	}

	protected onStart(): void {
		switch (this.whenNotAnimating) {
			case WhenNotAnimatingBehaviour.HIDE:
				this.popStyle('display');
				break;
			case WhenNotAnimatingBehaviour.HIDE_PRESERVE_LAYOUT:
				this.popStyle('visibility');
				break;
			case WhenNotAnimatingBehaviour.SHOW:
				break;
			default:
				throw new UnreachableError(
					'Unexpected `whenNotAnimating` behaviour',
				);
		}
	}

	protected onEnd(): void {
		switch (this.whenNotAnimating) {
			case WhenNotAnimatingBehaviour.HIDE:
				this.pushStyle('display', 'none');
				break;
			case WhenNotAnimatingBehaviour.HIDE_PRESERVE_LAYOUT:
				this.pushStyle('visibility', 'hidden');
				break;
			case WhenNotAnimatingBehaviour.SHOW:
				break;
			default:
				throw new UnreachableError(
					'Unexpected `whenNotAnimating` behaviour',
				);
		}
	}

	protected pushStyle(
		styleName: TNonReadonlyCssStyleDeclaration,
		style: string,
	) {
		let pushedStyles = this.originalStyleMap.get(styleName as string);

		if (pushedStyles == null) {
			pushedStyles = [];
			this.originalStyleMap.set(styleName as string, pushedStyles);
		}

		pushedStyles.push(this.elem.style[styleName] as string);

		// @ts-expect-error styles r wonky & contain functions
		this.elem.style[styleName] = style;
	}

	protected popStyle(styleName: TNonReadonlyCssStyleDeclaration) {
		const pushedStyles = this.originalStyleMap.get(styleName as string);

		if (pushedStyles == null || pushedStyles.length === 0) {
			return;
		}

		// @ts-expect-error styles r wonky & contain functions
		this.elem.style[styleName] = pushedStyles.pop()!;
	}
}
