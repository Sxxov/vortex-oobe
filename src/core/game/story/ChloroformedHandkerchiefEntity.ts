import handkerchiefDirty from '!p::../../../assets/img/sprites/cloth, on floor.png';
import handkerchief from '!p::../../../assets/img/sprites/cloth.png';
import { AlertComponent } from '../components/ui/AlertComponent';
import { InteractivePropEntity } from '../entities/InteractivePropEntity';
import { NullSprite } from '../sprite/NullSprite';
import { Sprite } from '../sprite/Sprite';

export class ChloroformedHandkerchiefEntity extends InteractivePropEntity.for(
	new Sprite(handkerchief),
	new Sprite(handkerchiefDirty),
	[14, 8, 2, 2],
	{
		heading: '',
		message: '',
		options: [''],
		sprite: new NullSprite(),
	},
	[6, 0, 0],
	true,
) {
	protected override async onUnconsumedInteraction() {
		await this.component(AlertComponent)!.alert(
			'Spl---?',
			'Why do I keep blowing my nose with Dr. Charles’s things; why does the handkerchief smell sweeter than usual; why, do I s-suddenly feel so so, tipsy...',
		);
	}
}
