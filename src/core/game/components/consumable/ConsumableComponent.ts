import { Store } from '../../../blocks/store';
import type { AbstractEntity } from '../../entities/AbstractEntity';
import type { Sprite } from '../../sprite/Sprite';
import { AbstractComponent } from '../common/AbstractComponent';
import { AbstractSpriteComponent } from '../sprites/AbstractSpriteComponent';

export abstract class ConsumableComponent extends AbstractComponent {
	public abstract consumedSprite: Sprite;
	public isConsumed = new Store(false);

	constructor(entity: AbstractEntity) {
		super(entity);

		this.assertEntityHas(AbstractSpriteComponent);

		const unsubscribe = this.isConsumed.subscribeLazy((isConsumed) => {
			if (isConsumed) {
				this.entity
					.component(AbstractSpriteComponent)
					?.sprite.set(this.consumedSprite);

				unsubscribe();
			}
		});
	}

	public static for(consumedSprite: Sprite) {
		return class extends ConsumableComponent {
			public consumedSprite = consumedSprite;
		};
	}

	public consume() {
		this.isConsumed.set(true);
	}
}
