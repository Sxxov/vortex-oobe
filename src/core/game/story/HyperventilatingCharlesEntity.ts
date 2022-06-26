import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { NullSprite } from '../sprite/NullSprite';
import { PlaceholderSprite } from '../sprite/PlaceholderSprite';

export class HyperventilatingCharlesEntity extends InteractivePropEntity.for(
	new PlaceholderSprite(),
	new NullSprite(),
	[28, 10, 2, 4],
	{
		heading: '',
		message: '',
		options: [''],
		sprite: new PlaceholderSprite(),
	},
	[0, 0, 2],
	true,
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Uhh... Uh...',
			'You see Dr. Charles hyperventilating in the corner of the classroom, & check up him. He says you don’t understand, it was his only way to quench the voices in his head. He’s not sure about what he wants to do next...',
		);
	}
}
