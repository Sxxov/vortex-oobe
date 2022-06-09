import { ShapedArrayStore } from '../../blocks/store/stores/ShapedArrayStore';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { NullSprite } from '../sprite/NullSprite';
import { PlaceholderSprite } from '../sprite/PlaceholderSprite';
import type { TPositionStore } from '../types/TPositionStore';
import { SafeWithPentagramBookEntity } from './SafeWithPentagramBookEntity';
import { SafeWithUnicornBookEntity } from './SafeWithUnicornBooksEntity';

export class BackpackWithLockEntity extends InteractivePropEntity.for(
	new PlaceholderSprite(),
	new NullSprite(),
	[2, 2],
	{
		heading: 'ZIP',
		message: 'Charles brings locks for the books and stores them in a safe',
		options: ['ok'],
		sprite: new PlaceholderSprite(),
	},
) {
	public override position: TPositionStore = new ShapedArrayStore([4, 10]);

	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'A COLORFUL SIGHT',
			'You use a pen to pry open the zip, see that there is a book with unicorns on it, & a book with a pentagram on it, but then get caught before you’re able to read what’s inside the books',
		);

		this.round.next?.entityPool.push(
			new SafeWithPentagramBookEntity(this.round),
			new SafeWithUnicornBookEntity(this.round),
		);
	}
}
