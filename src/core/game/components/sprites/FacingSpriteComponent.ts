import { Store } from '../../../blocks/store';
import { Directions } from '../../common/directions/Directions';
import type { AbstractEntity } from '../../entities/AbstractEntity';
import type { AbstractSprite } from '../../sprite/AbstractSprite';
import type { TCellSize } from '../../types/TCellSize';
import { AbstractSpriteComponent } from './AbstractSpriteComponent';

export abstract class FacingSpriteComponent<
	Sprite extends AbstractSprite,
> extends AbstractSpriteComponent<Sprite> {
	public abstract readonly sprites: { [x in Directions]: AbstractSprite };
	public abstract readonly facing: Store<Directions>;

	public static for(
		sprites: { [x in Directions]: AbstractSprite },
		size: TCellSize,
		initialDirection = Directions.DOWN,
	) {
		return class extends FacingSpriteComponent<typeof sprites[Directions]> {
			public readonly sprite = new Store<AbstractSprite>(
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
