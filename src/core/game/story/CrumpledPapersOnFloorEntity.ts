import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { PlaceholderSprite } from '../sprite/PlaceholderSprite';

export class CrumpledPapersOnFloorEntity extends InteractivePropEntity.for(
	new PlaceholderSprite(),
	new PlaceholderSprite(),
	[26, 9, 2, 2],
	{
		heading: 'Angry Dr. Charles face ):<',
		message: 'Dr. Charles keeps writing, frantically.',
		options: ['Hm...'],
		sprite: new PlaceholderSprite(),
	},
	[0, 4, 4],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Paper waste!',
			'You find a lot of essays written by Dr. Charles on the floor. You read one of the essays, it’s eerily detailed. You throw it back into the pile without a peep, he sees you doing that & seems slightly agitated.',
		);
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Nah',
			'You don’t really want to dig through that pile again.',
		);
	}
}
