import { Store } from '../../../blocks/store';
import { Directions } from '../../common/directions/Directions';
import type { AbstractEntity } from '../../entities/AbstractEntity';
import type { Sprite } from '../../sprite/Sprite';
import type { TCellSize } from '../../types/TCellSize';
import { AbstractSpriteComponent } from './AbstractSpriteComponent';

export abstract class FacingSpriteComponent extends AbstractSpriteComponent {
	public abstract readonly sprites: { [x in Directions]: Sprite };
	public abstract readonly facing: Store<Directions>;

	public static for(
		sprites: { [x in Directions]: Sprite },
		size: TCellSize,
		initialDirection = Directions.DOWN,
	) {
		return class extends FacingSpriteComponent {
			public readonly sprite = new Store<Sprite>(
				sprites[initialDirection],
			);

			public size = size;

			public readonly sprites = sprites;
			public readonly facing = new Store<Directions>(initialDirection);

			constructor(ctx: AbstractEntity) {
				super(ctx);

				this.facing.subscribeLazy((facing) => {
					this.sprite.set(sprites[facing]);
				});

				this.updateBoundingBox();
			}
		};
	}

	public face(direction: Directions) {
		this.facing.set(direction);
	}
}
