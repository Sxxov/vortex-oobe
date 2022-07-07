import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { PlaceholderSprite } from '../sprite/PlaceholderSprite';
import { AnotherCrumpledPaperOnFloorEntity } from './AnotherCrumpledPaperOnFloorEntity';

export class CrumpledPaperOnFloorEntity extends InteractivePropEntity.for(
	new PlaceholderSprite(),
	new PlaceholderSprite(),
	[1.5, 10, 2, 2],
	{
		heading: 'Happy Dr. Charles face (:',
		message:
			'Dr. Charles appreciates the compliment, & decides to write more.',
		options: ['go bestie!'],
		sprite: new PlaceholderSprite(),
	},
	[1, 3, 3],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Creative writing',
			'You uncrumple the paper on the floor, it’s an essay written by Dr. Charles! You find that it’s actually very well-written & casually compliment him about it.',
		);

		this.round.next?.entityPool.push(
			new AnotherCrumpledPaperOnFloorEntity(this.round.next),
		);
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Ehh',
			'It’s a pretty good essay, but you’re too lazy of a student to read it again.',
		);
	}
}
