import { ShapedArrayStore } from '../../blocks/store/stores/ShapedArrayStore';
import type { TUnabstract } from '../../blocks/types/TUnabstract';
import type { AbstractComponent } from '../components/common/AbstractComponent';
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
		this.round.entityPool.remove(this);
	}

	public static *surroundingEntityAndDistances(
		sourceEntity: AbstractEntity,
		targetEntities: AbstractEntity[],
	) {
		const { value: sourcePosition } = sourceEntity.position;

		for (const targetEntity of targetEntities) {
			const { value: targetPosition } = targetEntity.position;

			yield [
				targetEntity,
				this.distance(sourcePosition, targetPosition),
			] as const;
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

	public static distance(pos1: [number, number], pos2: [number, number]) {
		return Math.hypot(pos1[0] - pos2[0], pos1[1] - pos2[1]);
	}
}
