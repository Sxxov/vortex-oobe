import backpackwlock from '!p::../../../assets/img/sprites/backpack, w. lock.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { SafeWithPentagramBookEntity } from './SafeWithPentagramBookEntity';
import { SafeWithUnicornBookEntity } from './SafeWithUnicornBooksEntity';
export class BackpackWithLockEntity extends InteractivePropEntity.for(
	new Sprite(backpackwlock),
	new Sprite(backpackwlock),
	[24, 10, 2, 2],
	{
		heading: 'ZIP',
		message:
			'Dr. Charles brings locks for the books and stores them in a safe',
		options: ['ok'],
		sprite: new Sprite(backpackwlock),
	},
	[3, 3, 0],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'A COLORFUL SIGHT',
			'You use a pen to pry open the zip, see that there is a book with unicorns on it, & a book with a pentagram on it, but then get caught before you’re able to read what’s inside the books',
		);

		if (this.round.next) {
			const consumedBackpackWithLockEntity = new BackpackWithLockEntity(
				this.round.next,
			);
			consumedBackpackWithLockEntity.consumable.consume();

			this.round.next.entityPool.push(
				new SafeWithPentagramBookEntity(this.round.next),
			);
			this.round.next.entityPool.push(
				new SafeWithUnicornBookEntity(this.round.next),
			);
		}
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Hey hey hey!',
			'Dr. Charles changed the lock on this bag.',
		);
	}
}
