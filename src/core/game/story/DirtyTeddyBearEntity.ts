import { ShapedArrayStore } from '../../blocks/store/stores/ShapedArrayStore';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { NullSprite } from '../sprite/NullSprite';
import { PlaceholderSprite } from '../sprite/PlaceholderSprite';
import type { TPositionStore } from '../types/TPositionStore';
import { TissueEntity } from './TissueEntity';

export class DirtyTeddyBearEntity extends InteractivePropEntity.for(
	new PlaceholderSprite(),
	new NullSprite(),
	[2, 2],
	{
		heading: 'Life flashes before his eyes.',
		message:
			'Charles was stunned but he’s fine. He put the teddy bear in the trash & decides to bring tissues tomorrow just incase he gets anything else dirty thrown on him',
		options: ['ok'],
		sprite: new PlaceholderSprite(),
	},
) {
	public override position: TPositionStore = new ShapedArrayStore([4, 4]);

	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Boing!',
			'You throw the dirty teddy bear at Charles. Charles gets hit. The teddy bear is wet & smells bad, stunning him for a bit after he’s hit',
		);

		this.round.next?.entityPool.push(new TissueEntity(this.round));
	}
}
