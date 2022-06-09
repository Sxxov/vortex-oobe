import { ShapedArrayStore } from '../../blocks/store/stores/ShapedArrayStore';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { NullSprite } from '../sprite/NullSprite';
import { PlaceholderSprite } from '../sprite/PlaceholderSprite';
import type { TPositionStore } from '../types/TPositionStore';
import { SafeWithPentagramBookEntity } from './SafeWithPentagramBookEntity';

export class SafeWithUnicornBookEntity extends InteractivePropEntity.for(
	new PlaceholderSprite(),
	new NullSprite(),
	[2, 2],
	{
		heading: 'UGHHHH!',
		message:
			'Charles is so injured, he regrets bringing the books to class! Keeps them at home',
		options: ['ok'],
		sprite: new PlaceholderSprite(),
	},
) {
	public override position: TPositionStore = new ShapedArrayStore([6, 8]);

	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'MYSTERY REVEALED!',
			'You kick the safe out the window of the class and open it by damaging it. It seems like a cheap safe. You read the book and it has your name on it, it has a colorful rainbow cover. Charles jumps out the window to stop you!',
		);

		this.round.entityPool.removeAt(
			this.round.entityPool.findIndex(
				(v) => v instanceof SafeWithPentagramBookEntity,
			),
		);
	}
}
