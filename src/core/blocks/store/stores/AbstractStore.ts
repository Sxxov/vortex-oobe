import {
	IllegalAssignmentError,
	IllegalInvocationError,
} from '../../../../resources/errors/index.js';

type TSubscriber<T> = (v: T) => void;
type TInvalidateCallback = () => void;
type TSubscriberEntry<T> = [
	subscriber: TSubscriber<T>,
	onInvalidate: TInvalidateCallback,
];
type TUnsubscriber = () => void;
type TUpdater<T> = (v: T) => T;

export abstract class AbstractStore<T> {
	public isWritable = true;

	public abstract set(v: T): void;
	public abstract update(updater: TUpdater<T>): void;
	public abstract subscribe(
		subscriber: TSubscriber<T>,
		onInvalidate: TInvalidateCallback,
	): TUnsubscriber;
	public abstract subscribeLazy(
		subscriber: TSubscriber<T>,
		onInvalidate: TInvalidateCallback,
	): TUnsubscriber;
	protected abstract unsubscribe(entry: TSubscriberEntry<T>): void;

	public seal() {
		if (!this.isWritable) {
			throw new IllegalInvocationError(
				'Cannot seal non-writable store',
				this.constructor.name + '#seal()',
			);
		}

		this.isWritable = false;

		const { set } = this;

		this.set = this.nonWritableSet;

		return set.bind(this);
	}

	private nonWritableSet(_: T) {
		throw new IllegalAssignmentError(
			'This store is not writable',
			'PrimitiveStore#value',
		);
	}
}
