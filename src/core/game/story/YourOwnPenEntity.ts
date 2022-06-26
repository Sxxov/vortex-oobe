import pen from '!p::../../../assets/img/sprites/pen.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { NullSprite } from '../sprite/NullSprite';
import { Sprite } from '../sprite/Sprite';

export class YourOwnPenEntity extends InteractivePropEntity.for(
	new Sprite(pen),
	new NullSprite(),
	[22, 8, 2, 2],
	{
		heading: '',
		message: '',
		options: [''],
		sprite: new NullSprite(),
	},
	[0, 0, 2],
	true,
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'H-here’s mine...',
			'You try to give Dr. Charles one of your own pens out of sympathy, but he doesn’t shake the fact you broke his old ones. He seems to be a bit more upset than usual.',
		);
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'What are you doing?',
			'You already talked gave the pen to Dr. Charles.',
		);
	}
}
