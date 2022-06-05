import { Store } from '../../../blocks/store';
import type { AbstractEntity } from '../../entities/AbstractEntity';
import type { Sprite } from '../../sprite/Sprite';
import type { TCellSize } from '../../types/TCellSize';
import { AbstractComponent } from '../common/AbstractComponent';

export abstract class AbstractSpriteComponent extends AbstractComponent {
	public abstract sprite: Store<Sprite>;
	public abstract size: TCellSize;
	public boundingBox = new Store<DOMRect>(new DOMRect());

	constructor(entity: AbstractEntity) {
		super(entity);

		entity.position.subscribeLazy(this.updateBoundingBox.bind(this));
		entity.round.game.screenSpace.boundingBox.subscribeLazy(
			this.updateBoundingBox.bind(this),
		);
	}

	protected updateBoundingBox() {
		const [x, y] =
			this.entity.round.game.screenSpace.positionToScreenPosition(
				this.entity.position,
			);
		const [w, h] = this.entity.round.game.screenSpace.cellScreenSize;

		this.boundingBox.value.x = x;
		this.boundingBox.value.y = y;
		this.boundingBox.value.width = this.size[0] * w;
		this.boundingBox.value.height = this.size[1] * h;

		this.boundingBox.trigger();
	}
}
