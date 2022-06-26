import hyperventilatingcharles from '!p::../../../assets/img/sprites/charle, idle.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { YourOwnPenEntity } from './YourOwnPenEntity';

export class HyperventilatingCharlesEntity extends InteractivePropEntity.for(
	new Sprite(hyperventilatingcharles),
	new Sprite(hyperventilatingcharles),
	[28, 10, 2, 4],
	{
		heading: 'IS HE OKAY?',
		message:
			'You see Charles hyperventilating in the corner of the classroom, & decide to console him,He says you don’t understand, it was his only way to quench the voices in his mind, & he’s not sure if he can continue like this',
		options: ['Hm...'],
		sprite: new Sprite(hyperventilatingcharles),
	},
	[0, 0, 2],
	true,
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert('', '');

		if (this.round.next) {
			const consumedHyperventilatingCharlesEntity =
				new HyperventilatingCharlesEntity(this.round.next);
			consumedHyperventilatingCharlesEntity.consumable.consume();

			this.round.next.entityPool.push(
				new YourOwnPenEntity(this.round.next),
			);
		}
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'What are you doing?',
			'You already talked to Charles.',
		);
	}
}
