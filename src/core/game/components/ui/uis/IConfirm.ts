import type { IUi } from './IUi';
import type { UiKinds } from '../UiKinds';

export interface IConfirm extends IUi<boolean> {
	kind: UiKinds.CONFIRM;
	options: [yes: string, no: string];
}
