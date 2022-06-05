import { Store } from '../../blocks/store';
import { DoublyLinkedNode } from '../../doubly-linked/DoublyLinkedNode';
import { ConsumableComponent } from '../components/consumable/ConsumableComponent';
import { DoorEntity } from '../entities/DoorEntity';
import { PlayerEntity } from '../entities/PlayerEntity';
import type { Game } from '../Game';
import { EntityPool } from '../grid/EntityPool';

export class Round extends DoublyLinkedNode {
	private isPopulated = false;
	public isDreaming = new Store(false);
	public entityPool = new EntityPool();

	constructor(public game: Game, prev?: Round['prev'], next?: Round['next']) {
		super(prev, next);
	}

	public populate() {
		if (this.isPopulated) return;

		this.entityPool.push(new PlayerEntity(this));
		this.entityPool.push(new DoorEntity(this));

		if (this.prev)
			for (const entity of this.prev.entityPool) {
				const consumable = entity.component(ConsumableComponent);

				if (!consumable || consumable.isConsumed.value) continue;

				this.entityPool.push(entity);
			}

		this.isPopulated = true;
	}

	public dream() {
		this.isDreaming.set(true);
	}
}
