import { ShapedArrayStore } from '../../blocks/store/stores/ShapedArrayStore';
import { StaticSpriteComponent } from '../components/sprites/StaticSpriteComponent';
import { WallComponent } from '../components/wall/WallComponent';
import { NullSprite } from '../sprite/NullSprite';
import type { TCellRect } from '../types/TCellRect';
import type { TPositionStore } from '../types/TPositionStore';
import { AbstractEntity } from './AbstractEntity';

export abstract class WallEntity extends AbstractEntity {
	public static for(xywh: TCellRect) {
		return class extends WallEntity {
			public static override Components: typeof AbstractEntity['Components'] =
				[
					StaticSpriteComponent.for(new NullSprite(), [
						xywh[2],
						xywh[3],
					]),
					WallComponent,
				] as const;

			public override position: TPositionStore = new ShapedArrayStore([
				xywh[0],
				xywh[1],
			]);
		};
	}
}
