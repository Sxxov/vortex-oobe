import totebag from '../../../assets/img/sprites/tote bag.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { NullSprite } from '../sprite/NullSprite';
import { Sprite } from '../sprite/Sprite';
import { BackpackEntity } from './BackpackEntity';

export class ToteBagEntity extends InteractivePropEntity.for(
	new Sprite(totebag),
	new NullSprite(),
	[18, 8, 2, 2],
	{
		heading: 'A new bag would be nice',
		message:
			'Dr. Charles decides to bring a backpack instead of a totebag. Privacy’s a human right after all.',
		options: ['damn it!'],
		sprite: new Sprite(totebag),
	},
	[3, 3, 0],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Hey hey hey!',
			'You try to peek into the bag but Dr. Charles snatches it back before you’re able to. He hides it away.',
		);

		this.round.next?.entityPool.push(new BackpackEntity(this.round.next));
	}
}
