import { Store } from '../../blocks/store';
import type { Round } from './Round';

export class RoundStore extends Store<Round | undefined> {
	constructor(value: Round | undefined = undefined, isWritable?: boolean) {
		super(value, isWritable);
	}

	public end() {
		this.value?.end();
		this.update((v) => v?.next);
	}
}
