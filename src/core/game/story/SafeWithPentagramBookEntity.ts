import safeUnopened from '!p::../../../assets/img/sprites/safe, closed.png';
import safeOpenedSatan from '!p::../../../assets/img/sprites/safe, opened, satan.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { SafeWithUnicornBookEntity } from './SafeWithUnicornBooksEntity';
export class SafeWithPentagramBookEntity extends InteractivePropEntity.for(
	new Sprite(safeUnopened),
	new Sprite(safeOpenedSatan),
	[1.5, 18, 2, 2],
	{
		heading: 'UGHHHH!',
		message:
			'Dr. Charles is injured, he regrets bringing the books to class! Keeps them at home',
		options: ['ok'],
		sprite: new Sprite(safeOpenedSatan),
	},
	[0, 6, 4],
	true,
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'MYSTERY REVEALED!',
			'You kick the safe out the window of the class and open it by damaging it. It seems like a cheap safe. You read the book and it has your name on it, it has a scary bloody cover. Dr. Charles jumps out the window to stop you!',
		);

		if (this.round.next) {
			this.round.entityPool.removeAt(
				this.round.entityPool.findIndex(
					(v) => v instanceof SafeWithUnicornBookEntity,
				),
			);
		}
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Hey hey hey!',
			'Safe is empty, BECAUSE OF YOU ',
		);
	}
}
