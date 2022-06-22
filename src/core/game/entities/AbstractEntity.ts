import { ShapedArrayStore } from '../../blocks/store/stores/ShapedArrayStore';
import type { TUnabstract } from '../../blocks/types/TUnabstract';
import type { AbstractComponent } from '../components/common/AbstractComponent';
import { AbstractSpriteComponent } from '../components/sprites/AbstractSpriteComponent';
import type { Round } from '../round/Round';
import type { TPositionStore } from '../types/TPositionStore';

export abstract class AbstractEntity {
	public static readonly Components: readonly TUnabstract<
		typeof AbstractComponent
	>[] = [] as const;

	public readonly components: AbstractComponent[];

	public position: TPositionStore = new ShapedArrayStore([0, 0]);

	constructor(public round: Round) {
		this.components = (
			this.constructor as typeof AbstractEntity
		).Components.map((Component) => new Component(this));
	}

	destructor() {
		this.round.entityPool.remove(this);

		for (const component of this.components) component.destructor();
	}

	public component<T extends typeof AbstractComponent>(Class: T) {
		return this.components.find(
			(component) => component instanceof Class,
		) as InstanceType<T> | undefined;
	}

	public static component<T extends typeof AbstractComponent>(Class: T) {
		for (const Component of this.Components) {
			let ComponentClass = Component;

			do {
				if (ComponentClass === Class) return Class;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			} while ((ComponentClass = Object.getPrototypeOf(ComponentClass)));
		}
	}

	public surroundingEntityAndDistances() {
		return AbstractEntity.surroundingEntityAndDistances(
			this,
			this.round.entityPool.value,
		);
	}

	public near(cellDistance: number) {
		return AbstractEntity.near(
			this,
			this.round.entityPool.value,
			cellDistance,
		);
	}

	public remove() {
		console.log('remove', this.round, this.round.entityPool);
		this.destructor();
	}

	public static *surroundingEntityAndDistances(
		sourceEntity: AbstractEntity,
		targetEntities: AbstractEntity[],
	) {
		const sourceSprite = sourceEntity.component(AbstractSpriteComponent);
		const sourcePosition = [
			sourceEntity.position.value[0] + (sourceSprite?.size[0] ?? 0) / 2,
			sourceEntity.position.value[1] + (sourceSprite?.size[1] ?? 0) / 2,
		] as [number, number];

		for (const targetEntity of targetEntities) {
			const targetSprite = targetEntity.component(
				AbstractSpriteComponent,
			);
			const { value: targetPosition } = targetEntity.position;

			if (targetSprite) {
				yield [
					targetEntity,
					this.distanceRect(sourcePosition, [
						targetPosition[0],
						targetPosition[1],
						targetSprite.size[0],
						targetSprite.size[1],
					]),
				] as const;
			} else {
				yield [
					targetEntity,
					this.distance(sourcePosition, targetPosition),
				] as const;
			}
		}
	}

	public static near(
		sourceEntity: AbstractEntity,
		targetEntities: AbstractEntity[],
		cellDistance: number,
	) {
		const { value: sourcePosition } = sourceEntity.position;

		return targetEntities.filter((targetEntity) => {
			const { value: targetPosition } = targetEntity.position;

			return (
				cellDistance <= this.distance(sourcePosition, targetPosition)
			);
		});
	}

	public static distance(
		pos1: [x: number, y: number],
		pos2: [x: number, y: number],
	) {
		return Math.hypot(pos1[0] - pos2[0], pos1[1] - pos2[1]);
	}

	public static distanceRect(
		pos: [x: number, y: number],
		xywh: [x: number, y: number, w: number, h: number],
	) {
		const dx = Math.max(xywh[0] - pos[0], 0, pos[0] - (xywh[0] + xywh[2]));
		const dy = Math.max(xywh[1] - pos[1], 0, pos[1] - (xywh[1] + xywh[3]));

		return Math.hypot(dx, dy);
	}
}
