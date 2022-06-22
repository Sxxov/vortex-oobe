import { Store } from '../../blocks/store';
import { DoublyLinkedNode } from '../../doubly-linked/DoublyLinkedNode';
import { ConsumableComponent } from '../components/consumable/ConsumableComponent';
import { BackgroundEntity } from '../entities/BackgroundEntity';
import { ClassSurroundingWallEntity } from '../entities/ClassSurroundingWallEntity';
import { DoorEntity } from '../entities/DoorEntity';
import { PlayerEntity } from '../entities/PlayerEntity';
import { WallEntity } from '../entities/WallEntity';
import type { Game } from '../Game';
import { GameConstants } from '../GameConstants';
import { EntityPool } from '../grid/EntityPool';
import { RoundStates } from './RoundStates';

export class Round extends DoublyLinkedNode {
	private isPopulated = false;
	public state = new Store(RoundStates.IN_CLASS);
	public entityPool = new EntityPool();

	constructor(public game: Game, prev?: Round['prev'], next?: Round['next']) {
		super(prev, next);
	}

	public populate() {
		if (this.isPopulated) return;

		this.entityPool.unshift(
			new BackgroundEntity(this),
			new PlayerEntity(this),
			new DoorEntity(this),
			new ClassSurroundingWallEntity(this),
			new (WallEntity.for([0, 0, GameConstants.GRID_COLUMN_COUNT, 5]))(
				this,
			),
			new (WallEntity.for([0, 9, 3, GameConstants.GRID_ROW_COUNT - 9]))(
				this,
			),
			new (WallEntity.for([2, 5, 8, 2]))(this),
			new (WallEntity.for([13, 7, 8, 2]))(this),
			new (WallEntity.for([
				6,
				GameConstants.GRID_ROW_COUNT - 5,
				GameConstants.GRID_COLUMN_COUNT - 6,
				5,
			]))(this),
			new (WallEntity.for([0, GameConstants.GRID_ROW_COUNT - 5, 4, 5]))(
				this,
			),
		);

		if (this.prev)
			for (const entity of this.prev.entityPool) {
				const consumable = entity.component(ConsumableComponent);

				if (!consumable || consumable.isConsumed.value) continue;

				this.entityPool.push(entity);
			}

		this.isPopulated = true;
	}

	public restart() {
		this.state.set(RoundStates.IN_CLASS);
	}

	public dream() {
		this.state.set(RoundStates.IN_DREAM);
	}

	public end() {
		this.state.set(RoundStates.FINISHED);
	}
}
