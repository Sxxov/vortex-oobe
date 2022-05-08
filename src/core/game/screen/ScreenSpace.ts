import type { Store } from '../../blocks/store';
import { ShapedArrayStore } from '../../blocks/store/stores/ShapedArrayStore';
import { GameConstants } from '../GameConstants';
import type { TPosition } from '../types/TPosition';
import type { TScreenPosition } from '../types/TScreenPosition';

export class ScreenSpace {
	public cellScreenSize = new ShapedArrayStore<[w: number, h: number]>([
		0, 0,
	]);

	constructor(public boundingBox: Store<DOMRect>) {
		this.boundingBox.subscribe((boundingBox) => {
			this.cellScreenSize.set([
				boundingBox.width / GameConstants.GRID_COLUMN_COUNT,
				boundingBox.height / GameConstants.GRID_ROW_COUNT,
			]);
		});
	}

	public gamePositionToPosition([x, y]: TScreenPosition) {
		return [
			x / this.cellScreenSize.value[0],
			y / this.cellScreenSize.value[1],
		] as TPosition;
	}

	public screenPositionToPosition([x, y]: TScreenPosition) {
		return [
			(x - this.boundingBox.value.x) / this.cellScreenSize.value[0],
			(y - this.boundingBox.value.y) / this.cellScreenSize.value[1],
		] as TPosition;
	}

	public positionToGamePosition([x, y]: TPosition) {
		return [
			x * this.cellScreenSize.value[0],
			y * this.cellScreenSize.value[1],
		] as TScreenPosition;
	}

	public positionToScreenPosition([x, y]: TPosition) {
		return [
			x * this.cellScreenSize.value[0] + this.boundingBox.value.x,
			y * this.cellScreenSize.value[1] + this.boundingBox.value.y,
		] as TScreenPosition;
	}
}
