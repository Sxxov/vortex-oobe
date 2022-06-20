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

	protected override onIntersectingTouchStart(
		e: TouchEvent | MouseEvent,
	): void {
		e.preventDefault();

		const spriteComponent = this.entity.component(AbstractSpriteComponent)!;

		const destroy = () => {
			window.removeEventListener('touchend', onTouchEnd);
			window.removeEventListener('touchcancel', onTouchEnd);
			window.removeEventListener('mouseup', onTouchEnd);
			window.removeEventListener('mouseout', onMouseOut);
		};

		const onTouchEnd = () => {
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

		window.addEventListener('touchend', onTouchEnd);
		window.addEventListener('touchcancel', onTouchEnd);
		window.addEventListener('mouseup', onTouchEnd);
		window.addEventListener('mouseout', onMouseOut);
	}
}
