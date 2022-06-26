import stainedpenonfloor from '!p::../../../assets/img/sprites/pen.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { HyperventilatingCharlesEntity } from './HyperventilatingCharlesEntity';

export class StainedPenOnFloorEntity extends InteractivePropEntity.for(
	new Sprite(stainedpenonfloor),
	new Sprite(stainedpenonfloor),
	[21, 9.5, 2, 2],
	{
		heading: 'Confusing...',
		message:
			'Charles can’t find the black pen, he writes in blue ink from now',
		options: ['Hm...'],
		sprite: new Sprite(stainedpenonfloor),
	},
	[0, 4, 4],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Color blind?',
			'You find a red-stained pen on the floor,You pick it up & try writing with it. You find out the ink is black, & put it back down on the floor',
		);

		if (this.round.next) {
			const consumedStainedPenOnFloorEntity = new StainedPenOnFloorEntity(
				this.round.next,
			);
			consumedStainedPenOnFloorEntity.consumable.consume();

			this.round.next.entityPool.push(
				new HyperventilatingCharlesEntity(this.round.next),
			);
		}
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'What you looking for?',
			'You already used this pen.',
		);
	}
}
