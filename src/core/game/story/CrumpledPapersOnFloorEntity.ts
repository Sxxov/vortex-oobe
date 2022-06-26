import crumpledpapersonfloor from '!p::../../../assets/img/sprites/pen. w. paper.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { StainedPenOnFloorEntity } from './StainedPenOnFloorEntity';

export class CrumpledPapersOnFloorEntity extends InteractivePropEntity.for(
	new Sprite(crumpledpapersonfloor),
	new Sprite(crumpledpapersonfloor),
	[26, 9, 2, 2],
	{
		heading: 'ANGRY CHARLES FACE ;/',
		message: 'Charles keeps writing, frantically',
		options: ['Hm...'],
		sprite: new Sprite(crumpledpapersonfloor),
	},
	[0, 4, 4],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Paper Waste!',
			'You find a lot of essays written by Charles on the floor,You read one of the essays, it is eerily detailed. You throw it back into the pile, he sees you doing that & seems slightly agitated this time',
		);

		if (this.round.next) {
			const consumedCrumpledPapersOnFloorEntity =
				new CrumpledPapersOnFloorEntity(this.round.next);
			consumedCrumpledPapersOnFloorEntity.consumable.consume();

			this.round.next.entityPool.push(
				new StainedPenOnFloorEntity(this.round.next),
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
