import penWithPaper from '!p::../../../assets/img/sprites/pen, w. paper.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { NullSprite } from '../sprite/NullSprite';
import { Sprite } from '../sprite/Sprite';
import { CrumpledPaperOnFloorEntity } from './CrumpledPaperOnFloorEntity';

export class PensAndPaperEntity extends InteractivePropEntity.for(
	new Sprite(penWithPaper),
	new NullSprite(),
	[10, 14, 2, 2],
	{
		heading: 'Wack.',
		message:
			'Dr. Charles does not really like how the essay turned out, so he crumples it up & forgets about it.',
		options: ['shame...'],
		sprite: new Sprite(penWithPaper),
	},
	[0, 2, 2],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Game on!',
			'You invite Dr. Charles into an essay writing competition; he accepts.',
		);

		this.round.next?.entityPool.push(
			new CrumpledPaperOnFloorEntity(this.round.next),
		);
	}
}
