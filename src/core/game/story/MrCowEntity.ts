import binWithTeddy from '../../../assets/img/sprites/bin, w. teddy.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';

export class MrCowEntity extends InteractivePropEntity.for(
	new Sprite(binWithTeddy),
	new Sprite(binWithTeddy),
	[30, 6, 2, 2],
	{
		heading: 'Precious baby',
		message: 'You continue to feel bad for punching Mr. Cow.',
		options: ['regret.'],
		sprite: new Sprite(binWithTeddy),
	},
) {
	protected override async onUnconsumedInteraction() {
		await this.onConsumedInteraction();

		this.round.next?.entityPool.push(new MrCowEntity(this.round.next));
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Doof!',
			'You punch Mr. Cow. It falls over; you feel bad. You hug it in consolation.',
		);
	}
}
