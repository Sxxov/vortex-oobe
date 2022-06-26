import pensandpaper from '!p::../../../assets/img/sprites/pen. w. paper.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { CrumpledPaperOnFloorEntity } from './CrumpledPaperOnFloorEntity';

export class PensAndPaperEntity extends InteractivePropEntity.for(
	new Sprite(pensandpaper),
	new Sprite(pensandpaper),
	[10, 14, 2, 2],
	{
		heading: 'Tick!',
		message:
			'Charles does not really like how the essay turned out, so he throws the essay away',
		options: ['ok'],
		sprite: new Sprite(pensandpaper),
	},
	[0, 2, 2],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Tick!',
			'You invite Charles into a game of writing competition about video game violence in real-life and he accepts your challenge=',
		);

		if (this.round.next) {
			const consumedPensAndPaperEntity = new PensAndPaperEntity(
				this.round.next,
			);
			consumedPensAndPaperEntity.consumable.consume();

			this.round.next.entityPool.push(
				new CrumpledPaperOnFloorEntity(this.round.next),
			);
		}
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Hey hey hey!',
			'Dr. Charles prohibits you from using the pens. He doesn’t want you to finish the ink.',
		);
	}
}
