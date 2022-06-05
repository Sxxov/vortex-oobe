import { Store } from '../../../blocks/store';
import type { AbstractEntity } from '../../entities/AbstractEntity';
import type { Sprite } from '../../sprite/Sprite';
import type { TCellSize } from '../../types/TCellSize';
import { AbstractSpriteComponent } from './AbstractSpriteComponent';

export abstract class DynamicSpriteComponent extends AbstractSpriteComponent {
	public static for(initialSprite: Sprite, size: TCellSize) {
		return class extends DynamicSpriteComponent {
			public sprite = new Store(initialSprite);
			public size = size;

			constructor(entity: AbstractEntity) {
				super(entity);

				this.updateBoundingBox();
			}
		};
	}
}
