import { Store } from '../../../blocks/store';
import type { AbstractEntity } from '../../entities/AbstractEntity';
import type { AbstractSprite } from '../../sprite/AbstractSprite';
import type { TCellSize } from '../../types/TCellSize';
import { AbstractSpriteComponent } from './AbstractSpriteComponent';

export abstract class StaticSpriteComponent<
	Sprite extends AbstractSprite,
> extends AbstractSpriteComponent<Sprite> {
	public static for<Sprite extends AbstractSprite>(
		sprite: Sprite,
		size: TCellSize,
	) {
		return class extends StaticSpriteComponent<Sprite> {
			public sprite = new Store(sprite, false);
			public size = size;

			constructor(entity: AbstractEntity) {
				super(entity);

				this.updateBoundingBox();
			}
		};
	}
}
