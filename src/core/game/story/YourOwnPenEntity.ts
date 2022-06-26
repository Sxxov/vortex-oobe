import yourownpen from '!p::../../../assets/img/sprites/pen.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';

export class YourOwnPenEntity extends InteractivePropEntity.for(
	new Sprite(yourownpen),
	new Sprite(yourownpen),
	[22, 8, 2, 2],
	{
		heading: 'WHATS WRONG WITH HIM?',
		message:
			'You try to give Charles one of your own pens,Charles accuses you of breaking his old one, & that being the reason you felt guilty & gave him this new pen',
		options: ['ok'],
		sprite: new Sprite(yourownpen),
	},
	[0, 0, 2],
	true,
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert('', '');

		if (this.round.next) {
			const consumedYourOwnPenEntity = new YourOwnPenEntity(
				this.round.next,
			);
			consumedYourOwnPenEntity.consumable.consume();
		}
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'What are you doing?',
			'You already talked gave the pen to Charles.',
		);
	}
}
