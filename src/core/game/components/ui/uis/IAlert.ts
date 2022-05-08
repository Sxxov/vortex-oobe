import type { IUi } from './IUi';
import type { UiKinds } from '../UiKinds';

export interface IAlert extends IUi<void> {
	kind: UiKinds.ALERT;
	options: [ok: string];
}
