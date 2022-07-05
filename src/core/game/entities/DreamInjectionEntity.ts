import type { TUnabstract } from '../../blocks/types/TUnabstract';
import type { AbstractComponent } from '../components/common/AbstractComponent';
import { DreamComponent } from '../components/dream/DreamComponent';
import type { IDream } from '../components/dream/IDream';
import { AbstractEntity } from './AbstractEntity';

export abstract class DreamInjectionEntity extends AbstractEntity {
	public static for(dream: IDream) {
		return class extends DreamInjectionEntity {
			public static override readonly Components: readonly TUnabstract<
				typeof AbstractComponent
			>[] = [DreamComponent.for(dream)];
		};
	}
}
