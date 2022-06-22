import { ShapedArrayStore } from '../../blocks/store/stores/ShapedArrayStore';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { NullSprite } from '../sprite/NullSprite';
import { PlaceholderSprite } from '../sprite/PlaceholderSprite';
import type { TPositionStore } from '../types/TPositionStore';
import { BackpackEntity } from './BackpackEntity';

export class ToteBagEntity extends InteractivePropEntity.for(
	new PlaceholderSprite(),
	new NullSprite(),
	[2, 2],
	{
		heading: 'You made Dr. Charles mad!',
		message: 'Dr. Charles is changing his back from tote to backpack',
		options: ['damn it!'],
		sprite: new PlaceholderSprite(),
	},
) {
	public override position: TPositionStore = new ShapedArrayStore([6, 6]);

	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'woop',
			'You try to open the door but its not possible. Dr. Charles sees it and takes the bag from you!',
		);

		this.round.next?.entityPool.push(new BackpackEntity(this.round));
	}
}
