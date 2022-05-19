import { DoublyLinkedNode } from '../../doubly-linked/DoublyLinkedNode';
import { ConsumableComponent } from '../components/consumable/ConsumableComponent';
import { PlayerEntity } from '../entities/PlayerEntity';
import type { Game } from '../Game';
import { EntityPool } from '../grid/EntityPool';

export class Round extends DoublyLinkedNode {
	public isPopulated = false;
	public entityPool = new EntityPool();

	constructor(public game: Game, prev?: Round['prev'], next?: Round['next']) {
		super(prev, next);
	}

	public populate() {
		if (this.isPopulated) return;

		this.entityPool.push(new PlayerEntity(this));

		if (this.prev)
			for (const entity of this.prev.entityPool) {
				const consumable = entity.component(ConsumableComponent);

				if (!consumable || consumable.isConsumed.value) continue;

				this.entityPool.push(entity);
			}

		this.isPopulated = true;
	}
}
