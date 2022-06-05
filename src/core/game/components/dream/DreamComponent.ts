import { AbstractComponent } from '../common/AbstractComponent';
import type { TDream } from './TDream';

export abstract class DreamComponent extends AbstractComponent {
	public abstract ui: TDream;

	public static for(ui: TDream) {
		return class extends DreamComponent {
			public ui = { ...ui };
		};
	}
}
