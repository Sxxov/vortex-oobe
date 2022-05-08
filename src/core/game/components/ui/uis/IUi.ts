import type { AbstractSprite } from '../../../sprite/AbstractSprite';
import type { UiKinds } from '../UiKinds';

export interface IUi<R> {
	kind: UiKinds;
	sprite: AbstractSprite;
	heading: string;
	message: string;
	result?: R;
}
