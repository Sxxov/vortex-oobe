import penWithPaper from '!p::../../../assets/img/sprites/pen, w. paper.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { CrumpledPapersOnFloorEntity } from './CrumpledPapersOnFloorEntity';
import { StainedPenOnFloorEntity } from './StainedPenOnFloorEntity';

export class AnotherCrumpledPaperOnFloorEntity extends InteractivePropEntity.for(
	new Sprite(penWithPaper),
	new Sprite(penWithPaper),
	[1.5, 10, 2, 2],
	{
		heading: 'Very happy Dr. Charles face (:',
		message:
			'Dr. Charles appreciates the compliment again, & decides to write even more.',
		options: ['Hm...'],
		sprite: new Sprite(penWithPaper),
	},
	[2, 4, 4],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Why does he keep litering?',
			'You find another essay written by Dr. Charles, crumpled on the floor again. It’s a really detailed paper about video game violence! A topic he’s taught extensively. You compliment him again.',
		);

		this.round.next?.entityPool.push(
			new CrumpledPapersOnFloorEntity(this.round.next),
			new StainedPenOnFloorEntity(this.round.next),
		);
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Ehh',
			'It’s a pretty good essay, but you’re too lazy of a student to read it again.',
		);
	}
}
