import pen from '../../../assets/img/sprites/pen.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { SlatheredPenOnFloorEntity } from './SlatheredPenOnFloorEntity';

export class StainedPenOnFloorEntity extends InteractivePropEntity.for(
	new Sprite(pen),
	new Sprite(pen),
	[21, 9.5, 2, 2],
	{
		heading: 'His favourite pen...',
		message:
			'Dr. Charles can’t seem to find his black pen, he begrudgingly writes in blue ink from now',
		options: ['Hm...'],
		sprite: new Sprite(pen),
	},
	[0, 4, 4],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Colour’s an abstract concept',
			'You find a red-stained pen on the floor. You pick it up & try writing with it, finding out the ink is black instead. You wonder what stained its shell.',
		);

		this.round.next?.entityPool.push(
			new SlatheredPenOnFloorEntity(this.round.next),
		);
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'No change',
			'The pen is still red, who’d figure.',
		);
	}
}
