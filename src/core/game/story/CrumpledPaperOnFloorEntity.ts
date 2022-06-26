import crumpledpaperonfloor from '!p::../../../assets/img/sprites/pen. w. paper.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { AnotherCrumpledPaperOnFloorEntity } from './AnotherCrumpledPaperOnFloorEntity';

export class CrumpledPaperOnFloorEntity extends InteractivePropEntity.for(
	new Sprite(crumpledpaperonfloor),
	new Sprite(crumpledpaperonfloor),
	[1.5, 10, 2, 2],
	{
		heading: 'Re-Tick!',
		message:
			'Dr. Charles appreciates the compliment, & decides to write more',
		options: ['Natural Writer'],
		sprite: new Sprite(crumpledpaperonfloor),
	},
	[1, 3, 3],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'WORLD’ BEST DETECTIVE',
			'You find the essay written by Dr. Charles on the floor, after reading it you find it very detailed and compliment Dr. Charles about it.',
		);

		if (this.round.next) {
			const consumedCrumpledPaperOnFloorEntity =
				new CrumpledPaperOnFloorEntity(this.round.next);
			consumedCrumpledPaperOnFloorEntity.consumable.consume();

			this.round.next.entityPool.push(
				new AnotherCrumpledPaperOnFloorEntity(this.round.next),
			);
		}
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'What you looking for?',
			'You already read this paper.',
		);
	}
}
