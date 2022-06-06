import { ShapedArrayStore } from '../../blocks/store/stores/ShapedArrayStore';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { NullSprite } from '../sprite/NullSprite';
import { PlaceholderSprite } from '../sprite/PlaceholderSprite';
import type { TPositionStore } from '../types/TPositionStore';
// import { TissueEntity } from './TissueEntity';

export class ToteBagEntity extends InteractivePropEntity.for(
	new PlaceholderSprite(),
	new NullSprite(),
	[2, 2],
	{
		heading: 'You made Charles mad!',
		message: 'Charles is changing his back from tote to backpack',
		options: ['damn it!'],
		sprite: new PlaceholderSprite(),
	},
) {
	public override position: TPositionStore = new ShapedArrayStore([6, 6]);

	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'woop',
			'You try to open the door but its not possible. Charles sees it and takes the bag from you!',
		);

		// this.rou//nd.next?.entityPool.push(new TissueEntity(this.round));
	}
}
