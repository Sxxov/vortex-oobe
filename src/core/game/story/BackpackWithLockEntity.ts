import backpackWithLock from '../../../assets/img/sprites/backpack, w. lock.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { NullSprite } from '../sprite/NullSprite';
import { Sprite } from '../sprite/Sprite';
import { SafeWithPentagramBookEntity } from './SafeWithPentagramBookEntity';
import { SafeWithUnicornBookEntity } from './SafeWithUnicornBooksEntity';
export class BackpackWithLockEntity extends InteractivePropEntity.for(
	new Sprite(backpackWithLock),
	new NullSprite(),
	[24, 10, 2, 2],
	{
		heading: 'Bags don’t cut it',
		message:
			'Dr. Charles brings locks for the books and stores them in a safe.',
		options: ['ok'],
		sprite: new Sprite(backpackWithLock),
	},
	[3, 3, 0],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'A man of culture?',
			'You use a pen to pry open the zip on the backpack; lock smhlock~. You get to see that there is a book with unicorns on it & a book with a pentagram on it, before having the backpack snatched away as usual.',
		);

		this.round.next?.entityPool.push(
			new SafeWithPentagramBookEntity(this.round.next),
		);
		this.round.next?.entityPool.push(
			new SafeWithUnicornBookEntity(this.round.next),
		);
	}
}
