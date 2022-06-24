import Backpackentityimg from '!p::../../../assets/img/sprites/backpack.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { BackpackWithLockEntity } from './BackpackWithLockEntity';

export class BackpackEntity extends InteractivePropEntity.for(
	new Sprite(Backpackentityimg),
	new Sprite(Backpackentityimg),
	[22, 10, 2, 2],
	{
		heading: 'CLICK CLICK',
		message:
			'Dr. Charles is changing the Backpack code and adds a lock to the backpack',
		options: ['ok'],
		sprite: new Sprite(Backpackentityimg),
	},
	[3, 3, 0],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'CAUGHT!',
			'You attempt to sneakily open it, see that there are books inside, but then get caught before you’re able to see what they’re about!',
		);

		if (this.round.next) {
			const consumedBackpackEntity = new BackpackEntity(this.round.next);
			consumedBackpackEntity.consumable.consume();

			this.round.next.entityPool.push(
				new BackpackWithLockEntity(this.round.next),
				consumedBackpackEntity,
			);
		}
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Hey hey hey!',
			'Dr. Charles prohibits you from using the Backpack.',
		);
	}
}
