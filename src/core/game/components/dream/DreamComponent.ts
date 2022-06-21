import { AbstractComponent } from '../common/AbstractComponent';
import type { IDream } from './IDream';

export abstract class DreamComponent extends AbstractComponent {
	public abstract ui: IDream;

	public static for(ui: IDream) {
		return class extends DreamComponent {
			public ui = { ...ui };
		};
	}
}
