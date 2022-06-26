import safeClosed from '!p::../../../assets/img/sprites/safe, closed.png';
import safeOpenedSatan from '!p::../../../assets/img/sprites/safe, opened, satan.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { Sprite } from '../sprite/Sprite';
import { SafeWithUnicornBookEntity } from './SafeWithUnicornBooksEntity';
export class SafeWithPentagramBookEntity extends InteractivePropEntity.for(
	new Sprite(safeClosed),
	new Sprite(safeOpenedSatan),
	[1.5, 18, 2, 2],
	{
		heading: 'Books are for losers anyways...',
		message:
			'Dr. Charles decides he’ll just use an online journal or something.',
		options: ['save the trees, I guess?'],
		sprite: new Sprite(safeOpenedSatan),
	},
	[0, 6, 4],
	true,
) {
	protected override async onUnconsumedInteraction() {
		this.round.entityPool.removeAt(
			this.round.entityPool.findIndex(
				(v) => v instanceof SafeWithUnicornBookEntity,
			),
		);

		await this.component(AlertComponent)!.alert(
			'Piangg!',
			'You throw the other safe out the window, making Dr. Charles go chase after it instead.',
		);
		await this.component(AlertComponent)!.alert(
			'Pasar malam safe...',
			'Kicking the safe a bit, it opens. You then see the book from before with the pentagram on it & as you flip it open, you see only your name on it.',
		);
		await this.component(AlertComponent)!.alert(
			'...???',
			'You close the safe.',
		);
	}

	protected override async onConsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Hmm...',
			'You don’t really want to open the safe again... but you do want to kick it out the window.',
		);
	}
}
