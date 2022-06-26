import slatheredpenonfloor from '!p::../../../assets/img/sprites/pen.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { HyperventilatingCharlesEntity } from './HyperventilatingCharlesEntity';

export class SlatheredPenOnFloorEntity extends InteractivePropEntity.for(
	new Sprite(slatheredpenonfloor),
	new Sprite(slatheredpenonfloor),
	[21, 9.5, 2, 2],
	{
		heading: 'WHERE IS IT?',
		message: 'Dr. Charles doesn’t have any pens now, he is unable to write',
		options: ['Hm...'],
		sprite: new Sprite(slatheredpenonfloor),
	},
	[0, 6, 6],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Color blind?',
			'You find a red-substance-slathered pen on the floor,You don’t dare pick it up, so you kick it a bit, breaking it in the process',
		);

		if (this.round.next) {
			const consumedSlatheredPenOnFloorEntity =
				new SlatheredPenOnFloorEntity(this.round.next);
			consumedSlatheredPenOnFloorEntity.consumable.consume();

			this.round.next.entityPool.push(
				new HyperventilatingCharlesEntity(this.round.next),
			);
		}
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'What you looking for?',
			'You already destroyed this pen',
		);
	}
}
