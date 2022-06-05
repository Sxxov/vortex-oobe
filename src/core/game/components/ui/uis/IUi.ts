import type { Sprite } from '../../../sprite/Sprite';
import type { UiKinds } from '../UiKinds';

export interface IUi<R> {
	kind: UiKinds;
	sprite: Sprite;
	heading: string;
	message: string;
	result?: R;
}
