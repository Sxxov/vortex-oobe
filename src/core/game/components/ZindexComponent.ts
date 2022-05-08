import type { AbstractEntity } from '../entities/AbstractEntity';
import { AbstractComponent } from './AbstractComponent';
import { AbstractSpriteComponent } from './sprites/AbstractSpriteComponent';

export abstract class ZindexComponent extends AbstractComponent {
	public zindex = 0;

	constructor(entity: AbstractEntity) {
		super(entity);

		this.assertEntityHas(AbstractSpriteComponent);
	}

	public static for(zindex: number) {
		return class extends ZindexComponent {
			public override zindex = zindex;
		};
	}
}
