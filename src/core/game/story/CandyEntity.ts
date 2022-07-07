import lollipopEaten from '../../../assets/img/sprites/lolipop, eaten.png';
import lollipop from '../../../assets/img/sprites/lolipop.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { HandkerchiefEntity } from './HandkerchiefEntity';
import { TissueEntity } from './TissueEntity';

export class CandyEntity extends InteractivePropEntity.for(
	new Sprite(lollipop),
	new Sprite(lollipopEaten),
	[18, 8, 1, 2],
	{
		heading: 'Not stonks.',
		message:
			'Being out of tissues, Dr. Charles decides to instead bring a handkerchief tomorrow. Save the Earth, or something.',
		options: ['go mommy nature!'],
		sprite: new Sprite(lollipopEaten),
	},
	[4, 0, 2],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Nom nom nom... bleh!',
			'You eat the lollipop, but don’t like it at all! You spit it out into a tissue & Dr. Charles throws it away for you.',
		);

		const tissue = this.round.entityPool.find(
			(v) => v instanceof TissueEntity,
		);
		if (tissue) {
			await tissue
				.component(AlertComponent)!
				.alert(
					'Oh it’s out.',
					'You used the last tissue, guess everyone else’ll just have to find other ways to spit lollipops.',
				);
			tissue.remove();
		}

		this.round.next?.entityPool.push(
			new HandkerchiefEntity(this.round.next),
		);
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Bleh!',
			'You don’t like the lolipop.',
		);
	}
}
