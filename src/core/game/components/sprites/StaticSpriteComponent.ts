import { Store } from '../../../blocks/store';
import type { AbstractEntity } from '../../entities/AbstractEntity';
import type { Sprite } from '../../sprite/Sprite';
import type { TCellSize } from '../../types/TCellSize';
import { AbstractSpriteComponent } from './AbstractSpriteComponent';

export abstract class StaticSpriteComponent extends AbstractSpriteComponent {
	public static for(sprite: Sprite, size: TCellSize) {
		return class extends StaticSpriteComponent {
			public sprite = new Store(sprite, false);
			public size = size;

			constructor(entity: AbstractEntity) {
				super(entity);

				this.updateBoundingBox();
			}
		};
	}
}
