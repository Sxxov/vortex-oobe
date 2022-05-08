import { Store } from '../../../blocks/store';
import type { AbstractEntity } from '../../entities/AbstractEntity';
import type { AbstractSprite } from '../../sprite/AbstractSprite';
import type { TCellSize } from '../../types/TCellSize';
import { AbstractSpriteComponent } from './AbstractSpriteComponent';

export abstract class DynamicSpriteComponent<
	Sprite extends AbstractSprite,
> extends AbstractSpriteComponent<Sprite> {
	public static for<Sprite extends AbstractSprite>(
		initialSprite: Sprite,
		size: TCellSize,
	) {
		return class extends DynamicSpriteComponent<Sprite> {
			public sprite = new Store(initialSprite);
			public size = size;

			constructor(entity: AbstractEntity) {
				super(entity);

				this.updateBoundingBox();
			}
		};
	}
}
