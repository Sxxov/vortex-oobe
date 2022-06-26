import backpack from '../../../assets/img/sprites/backpack.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { NullSprite } from '../sprite/NullSprite';
import { Sprite } from '../sprite/Sprite';
import { BackpackWithLockEntity } from './BackpackWithLockEntity';

export class BackpackEntity extends InteractivePropEntity.for(
	new Sprite(backpack),
	new NullSprite(),
	[22, 10, 2, 2],
	{
		heading: '1234',
		message:
			'Dr. Charles decides to add a lock to his backpack. He really values his privacy, I guess.',
		options: ['ok'],
		sprite: new Sprite(backpack),
	},
	[3, 3, 0],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Hey hey hey! You again?',
			'You sneakily open the backpack & see that there are books inside. However, Dr. Charles snatches it away before you’re able to see what they’re about.',
		);

		this.round.next?.entityPool.push(
			new BackpackWithLockEntity(this.round.next),
		);
	}
}
