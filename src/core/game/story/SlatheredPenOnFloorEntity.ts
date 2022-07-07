import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { PlaceholderSprite } from '../sprite/PlaceholderSprite';
import { HyperventilatingCharlesEntity } from './HyperventilatingCharlesEntity';
import { YourOwnPenEntity } from './YourOwnPenEntity';

export class SlatheredPenOnFloorEntity extends InteractivePropEntity.for(
	new PlaceholderSprite(),
	new PlaceholderSprite(),
	[21, 9.5, 2, 2],
	{
		heading: 'Where is it???',
		message:
			'Dr. Charles can’t find either of his pens, & can’t continue to write',
		options: ['oh no'],
		sprite: new PlaceholderSprite(),
	},
	[0, 6, 6],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Time to wash your shoes',
			'You find a red-substance-slathered pen on the floor. You don’t really wanna pick it up, so you kick it a bit, breaking it in the process.',
		);

		this.round.next?.entityPool.push(
			new HyperventilatingCharlesEntity(this.round.next),
			new YourOwnPenEntity(this.round.next),
		);
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'What you looking for?',
			'You already destroyed this pen.',
		);
	}
}
