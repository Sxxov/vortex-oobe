import type { IUi } from './IUi';
import type { UiKinds } from '../UiKinds';

export interface IPrompt extends IUi<string> {
	kind: UiKinds.PROMPT;
	options: [ok: string, cancel: string];
}
