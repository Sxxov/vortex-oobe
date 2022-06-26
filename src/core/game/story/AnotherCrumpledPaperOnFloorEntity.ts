import anothercrumpledpaperonfloor from '!p::../../../assets/img/sprites/pen. w. paper.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { CrumpledPapersOnFloorEntity } from './CrumpledPapersOnFloorEntity';

export class AnotherCrumpledPaperOnFloorEntity extends InteractivePropEntity.for(
	new Sprite(anothercrumpledpaperonfloor),
	new Sprite(anothercrumpledpaperonfloor),
	[1.5, 10, 2, 2],
	{
		heading: 'HAPPY CHARLES FACE :)',
		message:
			'Charles appreciates the compliment, & decides to write even more',
		options: ['Hm...'],
		sprite: new Sprite(anothercrumpledpaperonfloor),
	},
	[2, 4, 4],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'WHO PUT THIS HERE?',
			'You find another essay written by Charles on the floor and read it again, it is a really detailed paper about video game violence! Charles is obsessed with this. You compliment him again',
		);

		if (this.round.next) {
			const consumedAnotherCrumpledPaperOnFloorEntity =
				new AnotherCrumpledPaperOnFloorEntity(this.round.next);
			consumedAnotherCrumpledPaperOnFloorEntity.consumable.consume();

			this.round.next.entityPool.push(
				new CrumpledPapersOnFloorEntity(this.round.next),
			);
		}
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'What you looking for?',
			'You already read these papers.',
		);
	}
}
