import tissueBox from '../../../assets/img/sprites/tissue box.png';
import tissueDirty from '../../../assets/img/sprites/tissue, dirty.png';
import { DreamComponent } from '../components/dream/DreamComponent';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { CandyEntity } from './CandyEntity';

export class TissueEntity extends InteractivePropEntity.for(
	new Sprite(tissueBox),
	new Sprite(tissueBox),
	[14, 8, 2, 2],
	{
		heading: 'Eww.',
		message:
			'Dr. Charles never wants to wear that shirt ever again. Perhaps bringing some candy might keep your orifices shut.',
		options: ['oh shirt'],
		sprite: new Sprite(tissueDirty),
	},
	[3, 0, 1],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Splat!',
			'You blow your nose into Dr. Charles’s tissues. You miss a little bit & get some on Dr. Charles’s shirt.',
		);

		if (this.round.next) {
			const consumedTissue = new TissueEntity(this.round.next);
			consumedTissue.consumable.consume();

			const [dream] = consumedTissue.components.splice(
				consumedTissue.components.findIndex(
					(v) => v instanceof DreamComponent,
				),
				1,
			);
			dream.destructor();

			this.round.next.entityPool.push(
				new CandyEntity(this.round.next),
				consumedTissue,
			);
		}
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Hey hey hey!',
			'Dr. Charles prohibits you from using the tissues. He doesn’t have that many shirts.',
		);
	}
}
