import teddy from '../../../assets/img/sprites/teddy.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { TissueEntity } from './TissueEntity';

export class DirtyTeddyBearEntity extends InteractivePropEntity.for(
	new Sprite(teddy),
	new Sprite(teddy),
	[6, 6, 2, 2],
	{
		heading: 'Why was the teddy bear wet??',
		message:
			'Dr. Charles put the teddy bear in the trash & decides to bring tissues tomorrow just incase he gets anything else dirty thrown on him',
		options: ['ok'],
		sprite: new Sprite(teddy),
	},
	[3, 0, 1],
) {
	protected override async onUnconsumedInteraction() {
		this.position.set([16, 12]);
		this.isNear.set(false);

		await this.component(AlertComponent)!.alert(
			'Boing!',
			'You throw the dirty teddy bear at Dr. Charles, hitting & stunning him. The teddy bear is wet & smells bad, you wonder who put that there',
		);

		this.round.next?.entityPool.push(new TissueEntity(this.round.next));
	}
}
