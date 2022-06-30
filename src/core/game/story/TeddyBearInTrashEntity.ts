import binWithTeddy from '../../../assets/img/sprites/bin, w. teddy.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { NullSprite } from '../sprite/NullSprite';
import { Sprite } from '../sprite/Sprite';
import { MrCowEntity } from './MrCowEntity';

export class TeddyBearInTrashEntity extends InteractivePropEntity.for(
	new Sprite(binWithTeddy),
	new NullSprite(),
	[30, 6, 2, 2],
	{
		heading: 'Stinky beary whatyawe?',
		message:
			'Dr. Charles takes the teddy bear out the trash & ensures it is dealt with. He brings another soft toy to distract the class instead.',
		options: ['damn he could’nt bear it'],
		sprite: new Sprite(binWithTeddy),
	},
	[3, 0, 0],
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Boing!',
			'You throw the teddy bear in the trash at Dr. Charles, hitting & stunning him. The teddy bear is dry now & smells even worse, bless him.',
		);

		this.round.next?.entityPool.push(new MrCowEntity(this.round.next));
	}
}
