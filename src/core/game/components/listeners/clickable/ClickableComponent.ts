import { AbstractSpriteComponent } from '../../sprites/AbstractSpriteComponent';
import { AbstractScreenListenerComponent } from '../AbstractScreenListenerComponent';
import { ClickableListenerKinds } from './ClickableListenerKinds';

export class ClickableComponent extends AbstractScreenListenerComponent {
	public static override ClassToListenerKindToListenerKeys = new Map<
		Function,
		ClickableComponent['listenerKindToListenerKeys']
	>();

	public declare listenerKindToListenerKeys: Map<
		ClickableListenerKinds,
		string[]
	>;

	protected override onIntersectingTouchStart(): void {
		const spriteComponent = this.entity.component(AbstractSpriteComponent)!;

		const onTouchMove = () => {
			destroy();
		};

		const onTouchEnd = (e: TouchEvent | MouseEvent) => {
			const touchScreenPositions =
				ClickableComponent.eventToScreenTouchPositions(e);

			const intersectingScreenPositions =
				ClickableComponent.intersectingScreenTouchPositions(
					touchScreenPositions,
					spriteComponent.boundingBox.value,
				);

			if (intersectingScreenPositions.length > 0)
				this.emit(ClickableListenerKinds.CLICK, []);

			destroy();
		};

		const onTouchCancel = () => {
			destroy();
		};

		const onMouseOut = (e: MouseEvent) => {
			if (!e.relatedTarget) onTouchCancel();
		};

		const destroy = () => {
			window.removeEventListener('touchmove', onTouchMove);
			window.removeEventListener('touchend', onTouchEnd);
			window.removeEventListener('touchcancel', onTouchCancel);
			window.removeEventListener('mouseup', onTouchEnd);
			window.removeEventListener('mouseout', onMouseOut);
			window.removeEventListener('mousemove', onTouchMove);
		};

		window.addEventListener('touchmove', onTouchMove);
		window.addEventListener('touchend', onTouchEnd);
		window.addEventListener('touchcancel', onTouchCancel);
		window.addEventListener('mousemove', onTouchMove);
		window.addEventListener('mouseup', onTouchEnd);
		window.addEventListener('mouseout', onMouseOut);
	}
}
