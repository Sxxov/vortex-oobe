// copied from svelte's implementation

import { AbstractStore } from './stores/AbstractStore.js';

type TSubscriber<T> = [(value: T) => void, () => void];
export type TStorify<T> = T extends infer U ? Store<U> : never;

export class Store<T = unknown> extends AbstractStore<T> {
	public subscribers: TSubscriber<T>[] = [];
	public subscriberQueue: T[] = [];
	private stop: (() => void) | null = null;

	constructor(public value: T, public override isWritable = true) {
		super();
	}

	private static neq(a: unknown, b: unknown): boolean {
		// @ts-expect-error unknown assignment
		// eslint-disable-next-line no-self-compare, eqeqeq, no-negated-condition
		return a != a
			? // eslint-disable-next-line no-self-compare, eqeqeq
			  b == b
			: a !== b ||
					(a && typeof a === 'object') ||
					typeof a === 'function'!;
	}

	public set(newValue: T): void {
		if (Store.neq(this.value, newValue)) {
			this.value = newValue;

			this.trigger();
		}
	}

	public trigger(): void {
		if (!this.stop) {
			return;
		}

		// store is ready
		const runQueue = !this.subscriberQueue.length;

		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let i = 0; i < this.subscribers.length; i += 1) {
			const s = this.subscribers[i];

			s[1]();
			// @ts-expect-error don't event know why
			this.subscriberQueue.push(s, this.value);
		}

		if (runQueue) {
			for (let i = 0; i < this.subscriberQueue.length; i += 2) {
				// @ts-expect-error unknown call
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				this.subscriberQueue[i][0](this.subscriberQueue[i + 1]);
			}

			this.subscriberQueue.length = 0;
		}
	}

	public update(fn: (value: T) => T): void {
		this.set(fn(this.value));
	}

	public subscribe(
		run: (value: T) => void,
		invalidate = () => {},
	): () => void {
		const subscriber: TSubscriber<T> = [run, invalidate];

		this.subscribers.push(subscriber);

		if (this.subscribers.length === 1) {
			this.stop = () => {};
		}

		run(this.value);

		return () => {
			this.unsubscribe(subscriber);
		};
	}

	public subscribeLazy(run: (value: T) => void, invalidate = () => {}) {
		const subscriber: TSubscriber<T> = [run, invalidate];

		this.subscribers.push(subscriber);

		if (this.subscribers.length === 1) {
			this.stop = () => {};
		}

		return () => {
			this.unsubscribe(subscriber);
		};
	}

	public unsubscribe(subscriber: TSubscriber<T>): void {
		const index = this.subscribers.indexOf(subscriber);

		if (index !== -1) {
			this.subscribers.splice(index, 1);
		}

		if (this.subscribers.length === 0) {
			this.stop?.();
			this.stop = null;
		}
	}
}
