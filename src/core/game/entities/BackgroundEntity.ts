import { StaticSpriteComponent } from '../components/sprites/StaticSpriteComponent';
import { GameConstants } from '../GameConstants';
import { Sprite } from '../sprite/Sprite';
import { AbstractEntity } from './AbstractEntity';
import sprite from '!p::../../../assets/img/sprites/background.png';

export class BackgroundEntity extends AbstractEntity {
	public static override Components: typeof AbstractEntity['Components'] = [
		StaticSpriteComponent.for(new Sprite(sprite), [
			GameConstants.GRID_COLUMN_COUNT,
			GameConstants.GRID_ROW_COUNT,
		]),
	] as const;
}
