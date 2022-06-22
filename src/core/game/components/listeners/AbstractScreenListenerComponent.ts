import { UnreachableError } from '../../../../resources/errors';
import type { AbstractEntity } from '../../entities/AbstractEntity';
import type { TScreenTouchPosition } from '../../types/TScreenTouchPosition';
import { AbstractSpriteComponent } from '../sprites/AbstractSpriteComponent';
import { AbstractListenerComponent } from './AbstractListenerComponent';
import { ellipseBox } from 'intersects';

export abstract class AbstractScreenListenerComponent extends AbstractListenerComponent {
	constructor(entity: AbstractEntity) {
		super(entity);

		this.assertEntityHas(AbstractSpriteComponent);

		window.addEventListener('touchstart', this.onTouchStart);
		window.addEventListener('mousedown', this.onTouchStart);
	}

	override destructor() {
		super.destructor();

		window.removeEventListener('touchstart', this.onTouchStart);
		window.removeEventListener('mousedown', this.onTouchStart);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onIntersectingTouchStart(e: TouchEvent | MouseEvent) {}

	protected onTouchStart = (e: TouchEvent | MouseEvent) => {
		if (e.cancelable) e.preventDefault();

		if (this.entity.round.game.uiQueue.length > 0) return;

		const touchScreenPositions =
			AbstractScreenListenerComponent.eventToScreenTouchPositions(e);

		const spriteComponent = this.entity.component(AbstractSpriteComponent)!;
		const intersectingScreenPositions =
			AbstractScreenListenerComponent.intersectingScreenTouchPositions(
				touchScreenPositions,
				spriteComponent.boundingBox.value,
			);

		if (intersectingScreenPositions.length > 0)
			this.onIntersectingTouchStart(e);
	};

	protected static eventToScreenTouchPositions(
		e: TouchEvent | MouseEvent,
	): TScreenTouchPosition[] {
		if (typeof TouchEvent !== 'undefined' && e instanceof TouchEvent)
			return Array.from(e.touches).map(
				({ clientX, clientY, radiusX, radiusY }) => [
					clientX,
					clientY,
					radiusX * 20,
					radiusY * 20,
				],
			);

		if (typeof MouseEvent !== 'undefined' && e instanceof MouseEvent)
			return [[e.clientX, e.clientY, 1, 1]];

		throw new UnreachableError(
			`unknown touch event type: ${e.constructor.name}`,
		);
	}

	protected static intersectingScreenTouchPositions(
		screenPositions: TScreenTouchPosition[],
		rect: DOMRect,
	) {
		return screenPositions.filter(([x, y, rx, ry]) =>
			ellipseBox(x, y, rx, ry, rect.x, rect.y, rect.width, rect.height),
		);
	}
}
