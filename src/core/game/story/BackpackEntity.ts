import { ShapedArrayStore } from '../../blocks/store/stores/ShapedArrayStore';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { NullSprite } from '../sprite/NullSprite';
import { PlaceholderSprite } from '../sprite/PlaceholderSprite';
import type { TPositionStore } from '../types/TPositionStore';
// import { TissueEntity } from './TissueEntity';

export class BackpackEntity extends InteractivePropEntity.for(
	new PlaceholderSprite(),
	new NullSprite(),
	[2, 2],
	{
		heading: 'CLICK CLICK',
		message:
			'Charles is changing the Backpack code and adds a lock to the backpack',
		options: ['ok'],
		sprite: new PlaceholderSprite(),
	},
) {
	public override position: TPositionStore = new ShapedArrayStore([4, 8]);

	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'CAUGHT!',
			'You attempt to sneakily open it, see that there are books inside, but then get caught before you’re able to see what they’re about and you get caught!',
		);

		// this.round.next?.entityPool.push(new TissueEntity(this.round));
	}
}
