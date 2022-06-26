import handkerchiefDirty from '../../../assets/img/sprites/cloth, on floor.png';
import handkerchief from '../../../assets/img/sprites/cloth.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { ChloroformedHandkerchiefEntity } from './ChloroformedHandkerchiefEntity';

export class StainedHandkerchiefEntity extends InteractivePropEntity.for(
	new Sprite(handkerchief),
	new Sprite(handkerchiefDirty),
	[14, 8, 2, 2],
	{
		heading: 'It didn’t work?',
		message:
			'Dr. Charles uses a special substance to soak the same handkerchief, making sure to absolutely douse it this time.',
		options: ['sounds clean, i guess'],
		sprite: new Sprite(handkerchief),
	},
	[6, 0, 0],
	true,
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Spl-?',
			'You blow your nose into Dr. Charles’s handkerchief, but notice a weird smell & stain as you do it. “It doesn’t really smell right”, you tell Dr. Charles.',
		);

		this.round.next?.entityPool.push(
			new ChloroformedHandkerchiefEntity(this.round.next),
		);
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Sniff, sniff...',
			'You smell the handkerchief again... Its smell stays weird',
		);
	}
}
