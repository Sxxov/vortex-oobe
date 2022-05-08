import { Store } from '../../blocks/store';
import type { AbstractEntity } from '../entities/AbstractEntity';
import type { AbstractSprite } from '../sprite/AbstractSprite';
import { AbstractComponent } from './AbstractComponent';
import { AbstractSpriteComponent } from './sprites/AbstractSpriteComponent';

export abstract class ConsumableComponent extends AbstractComponent {
	public abstract consumedSprite: AbstractSprite;
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

	public static for(consumedSprite: AbstractSprite) {
		return class extends ConsumableComponent {
			public consumedSprite = consumedSprite;
		};
	}

	public consume() {
		this.isConsumed.set(true);
	}
}
