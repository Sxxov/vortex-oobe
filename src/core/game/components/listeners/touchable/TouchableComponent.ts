import { UnreachableError } from '../../../../../resources/errors';
import { AbstractSpriteComponent } from '../../sprites/AbstractSpriteComponent';
import { TouchableListenerKinds } from './TouchableListenerKinds';
import { AbstractScreenListenerComponent } from '../AbstractScreenListenerComponent';
import type { TScreenTouchPosition } from '../../../types/TScreenTouchPosition';

export class TouchableComponent extends AbstractScreenListenerComponent {
	public static override ClassToListenerKindToListenerKeys = new Map<
		Function,
		TouchableComponent['listenerKindToListenerKeys']
	>();

	public declare listenerKindToListenerKeys: Map<
		TouchableListenerKinds,
		string[]
	>;

	protected override onIntersectingTouchStart(e: TouchEvent | MouseEvent) {
		e.preventDefault();

		const spriteComponent = this.entity.component(AbstractSpriteComponent)!;

		for (const [kind, keys] of this.listenerKindToListenerKeys) {
			let resolve: (v: TScreenTouchPosition[]) => void;
			let promise: Promise<TScreenTouchPosition[]> | undefined =
				new Promise((r) => {
					resolve = r;
				});

			const asyncIterable: AsyncIterable<TScreenTouchPosition[]> = {
				[Symbol.asyncIterator]: () => ({
					async next() {
						return {
							value: await promise!,
							// if there's no next promise, then it's done
							done: !promise,
						};
					},
					async return(value: TScreenTouchPosition[]) {
						promise = undefined;

						destroy();

						return { value, done: true };
					},
				}),
			};

			const onMouseOut = (e: MouseEvent) => {
				if (!e.relatedTarget) onTouchEnd(e);
			};

			const onTouchMove = (e: TouchEvent | MouseEvent) => {
				// unconfined won't check if the touch is inside of the bounding box
				// & will fire regardless until the user lets go
				if (kind === TouchableListenerKinds.UNCONFINED) {
					resolve(TouchableComponent.eventToScreenTouchPositions(e));

					promise = new Promise((r) => {
						resolve = r;
					});
				}
				// confined will only fire if the touch is inside of the bounding box
				// & will stop listening when the user leaves the bounding box
				else if (kind === TouchableListenerKinds.CONFINED) {
					const intersectingScreenPositions =
						TouchableComponent.intersectingScreenTouchPositions(
							TouchableComponent.eventToScreenTouchPositions(e),
							spriteComponent.boundingBox.value,
						);

					resolve(intersectingScreenPositions);

					if (intersectingScreenPositions.length > 0) {
						promise = new Promise((r) => {
							resolve = r;
						});
					} else onTouchEnd(e);
				} else
					throw new UnreachableError(
						`unrecognised touchable listener kind: ${
							kind as string
						}`,
					);
			};

			const onTouchEnd = (e: TouchEvent | MouseEvent) => {
				resolve(
					kind === TouchableListenerKinds.UNCONFINED
						? TouchableComponent.eventToScreenTouchPositions(e)
						: TouchableComponent.intersectingScreenTouchPositions(
								TouchableComponent.eventToScreenTouchPositions(
									e,
								),
								spriteComponent.boundingBox.value,
						  ),
				);
				promise = undefined;

				destroy();
			};

			const destroy = () => {
				window.removeEventListener('touchmove', onTouchMove);
				window.removeEventListener('touchend', onTouchEnd);
				window.removeEventListener('touchcancel', onTouchEnd);
				window.removeEventListener('mousemove', onTouchMove);
				window.removeEventListener('mouseup', onTouchEnd);
				window.removeEventListener('mouseout', onMouseOut);
			};

			onTouchMove(e);

			window.addEventListener('touchmove', onTouchMove);
			window.addEventListener('touchend', onTouchEnd);
			window.addEventListener('touchcancel', onTouchEnd);
			window.addEventListener('mousemove', onTouchMove);
			window.addEventListener('mouseup', onTouchEnd);
			window.addEventListener('mouseout', onMouseOut);

			// @ts-expect-error can't really type this here, but it's enforced elsewhere
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			for (const key of keys) void this.entity[key](asyncIterable);
		}
	}
}
