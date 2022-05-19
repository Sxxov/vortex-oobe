import type { ClickableListenerKinds } from './ClickableListenerKinds';

export interface IClickableListenerSignatures {
	[ClickableListenerKinds.CLICK]: () => Promise<boolean>;
}
