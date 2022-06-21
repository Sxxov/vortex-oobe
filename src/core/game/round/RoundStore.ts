import { Store } from '../../blocks/store';
import type { Round } from './Round';

export class RoundStore extends Store<Round | undefined> {
	public end() {
		this.value?.end();
		this.update((v) => v?.next);
	}
}
