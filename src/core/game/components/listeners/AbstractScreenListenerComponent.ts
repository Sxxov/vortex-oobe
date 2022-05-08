import { UnreachableError } from '../../../../resources/errors';
import type { AbstractEntity } from '../../entities/AbstractEntity';
import type { TScreenPosition } from '../../types/TScreenPosition';
import { AbstractSpriteComponent } from '../sprites/AbstractSpriteComponent';
import { AbstractListenerComponent } from './AbstractListenerComponent';

export abstract class AbstractScreenListenerComponent extends AbstractListenerComponent {
	constructor(entity: AbstractEntity) {
		super(entity);

		this.assertEntityHas(AbstractSpriteComponent);

		const onTouchStart = this.onTouchStart.bind(this);
		window.addEventListener('touchstart', onTouchStart);
		window.addEventListener('mousedown', onTouchStart);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onIntersectingTouchStart(e: TouchEvent | MouseEvent) {}

	protected onTouchStart(e: TouchEvent | MouseEvent) {
		if (this.entity.round.game.uiQueue.length > 0) return;

		const touchScreenPositions =
			AbstractScreenListenerComponent.eventToScreenPositions(e);

		const spriteComponent = this.entity.component(AbstractSpriteComponent)!;
		const intersectingScreenPositions =
			AbstractScreenListenerComponent.intersectingScreenPositions(
				touchScreenPositions,
				spriteComponent.boundingBox.value,
			);

		if (intersectingScreenPositions.length > 0)
			this.onIntersectingTouchStart(e);
	}

	protected static eventToScreenPositions(
		e: TouchEvent | MouseEvent,
	): TScreenPosition[] {
		if (typeof TouchEvent !== 'undefined' && e instanceof TouchEvent)
			return Array.from(e.touches).map(({ clientX, clientY }) => [
				clientX,
				clientY,
			]);

		if (typeof MouseEvent !== 'undefined' && e instanceof MouseEvent)
			return [[e.clientX, e.clientY]];

		throw new UnreachableError(
			`unknown touch event type: ${e.constructor.name}`,
		);
	}

	protected static intersectingScreenPositions(
		screenPositions: TScreenPosition[],
		rect: DOMRect,
	) {
		return screenPositions.filter(
			([x, y]) =>
				x > rect.left &&
				x < rect.right &&
				y > rect.top &&
				y < rect.bottom,
		);
	}
}
