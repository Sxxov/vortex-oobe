import { ShapedArrayStore } from '../../blocks/store/stores/ShapedArrayStore';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { NullSprite } from '../sprite/NullSprite';
import { PlaceholderSprite } from '../sprite/PlaceholderSprite';
import type { TPositionStore } from '../types/TPositionStore';

export class TissueEntity extends InteractivePropEntity.for(
	new PlaceholderSprite(),
	new NullSprite(),
	[2, 2],
	{
		heading: 'Eww.',
		message:
			'Charles decides to never wear that shirt ever again. He brings a new set of clothes tomorrow just incase',
		options: ['oh shirt'],
		sprite: new PlaceholderSprite(),
	},
) {
	public override position: TPositionStore = new ShapedArrayStore([6, 6]);

	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Splat!',
			'You blow your nose into Charles’s tissues. You miss a little bit & get some on Charles’s shirt',
		);
	}
}
