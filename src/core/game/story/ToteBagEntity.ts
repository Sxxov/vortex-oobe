import totebagimg from '!p::../../../assets/img/sprites/tote bag.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { BackpackEntity } from './BackpackEntity';

export class ToteBagEntity extends InteractivePropEntity.for(
	new Sprite(totebagimg),
	new Sprite(totebagimg),
	[18, 8, 2, 2],
	{
		heading: 'You made Dr. Charles mad!',
		message: 'Dr. Charles is changing his back from tote to backpack',
		options: ['damn it!'],
		sprite: new Sprite(totebagimg),
	},
	[3, 3, 0],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'woop',
			'You try to open the bag but its not possible. Dr. Charles sees it and takes the bag from you!',
		);

		if (this.round.next) {
			const consumedToteBagEntity = new ToteBagEntity(this.round.next);
			consumedToteBagEntity.consumable.consume();

			this.round.next.entityPool.push(
				new BackpackEntity(this.round.next),
				consumedToteBagEntity,
			);
		}
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Hey hey hey!',
			'Dr. Charles prohibits you from using the Totebag. He doesn’t want you to look in the bag.',
		);
	}
}
