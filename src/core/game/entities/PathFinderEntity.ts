import { StaticSpriteComponent } from '../components/sprites/StaticSpriteComponent';
import { PlaceholderSprite } from '../sprite/PlaceholderSprite';
import { AbstractEntity } from './AbstractEntity';

export class PathFinderEntity extends AbstractEntity {
	public static override readonly Components = [
		StaticSpriteComponent.for(new PlaceholderSprite(), [1, 1]),
	] as const;
}
