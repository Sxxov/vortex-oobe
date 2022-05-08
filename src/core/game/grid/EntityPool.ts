import { ArrayStore } from '../../blocks/store/stores/ArrayStore';
import { AbstractSpriteComponent } from '../components/sprites/AbstractSpriteComponent';
import { WallComponent } from '../components/WallComponent';
import type { AbstractEntity } from '../entities/AbstractEntity';
import { GameConstants } from '../GameConstants';
import type { TCellIndex } from '../types/TCellIndex';
import type { TPosition } from '../types/TPosition';

export class EntityPool extends ArrayStore<AbstractEntity> {
	public toAstar() {
		const result = new Array<number[]>(GameConstants.GRID_COLUMN_COUNT)
			.fill(undefined as any)
			.map(() => new Array<number>(GameConstants.GRID_ROW_COUNT).fill(1));

		for (const entity of this) {
			const [x, y] = EntityPool.positionToCellIndex(entity.position);
			const isWall = Boolean(entity.component(WallComponent));
			const sprite = entity.component(AbstractSpriteComponent);

			if (isWall && sprite) {
				const [leftCell, topCell] = EntityPool.positionToCellIndex(
					entity.round.game.screenSpace.screenPositionToPosition([
						sprite.boundingBox.value.left,
						sprite.boundingBox.value.top,
					]),
				);
				const [xCellCount, yCellCount] = EntityPool.positionToCellIndex(
					[
						sprite.boundingBox.value.width /
							entity.round.game.screenSpace.cellScreenSize
								.value[0],
						sprite.boundingBox.value.height /
							entity.round.game.screenSpace.cellScreenSize
								.value[1],
					],
				);

				for (let x = 0, l = xCellCount; x < l; ++x) {
					for (let y = 0, ll = yCellCount; y < ll; ++y) {
						result[leftCell + x][topCell + y] = 0;
					}
				}
			} else {
				result[x][y] = Number(isWall);
			}
		}

		return result;
	}

	public static positionToCellIndex([x, y]: TPosition) {
		return [
			Math.max(
				0,
				Math.min(GameConstants.GRID_COLUMN_COUNT - 1, Math.floor(x)),
			),
			Math.max(
				0,
				Math.min(GameConstants.GRID_ROW_COUNT - 1, Math.floor(y)),
			),
		] as TCellIndex;
	}
}
