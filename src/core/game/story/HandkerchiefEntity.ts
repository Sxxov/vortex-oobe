import handkerchiefDirty from '../../../assets/img/sprites/cloth, on floor.png';
import handkerchief from '../../../assets/img/sprites/cloth.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { StainedHandkerchiefEntity } from './StainedHandkerchiefEntity';

export class HandkerchiefEntity extends InteractivePropEntity.for(
	new Sprite(handkerchief),
	new Sprite(handkerchiefDirty),
	[14, 8, 2, 2],
	{
		heading: 'Not stonks.',
		message:
			'Being out of shoes, Dr. Charles decides to instead embrace nature & go barefoot. What’s the worst that could happen?.',
		options: ['tetanus'],
		sprite: new Sprite(handkerchief),
	},
	[4, 0, 2],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Splot!',
			'You blow your nose into Dr. Charles’s handkerchief. You were more careful this time, so instead you get it on his shoes.',
		);

		this.round.next?.entityPool.push(
			new StainedHandkerchiefEntity(this.round.next),
		);
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Slimey...',
			'You would not want to be the one cleaning that handkerchief.',
		);
	}
}
