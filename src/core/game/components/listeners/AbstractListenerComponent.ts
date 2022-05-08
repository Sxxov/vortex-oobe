import { IllegalStateError } from '../../../../resources/errors';
import type { AbstractEntity } from '../../entities/AbstractEntity';
import { AbstractComponent } from '../AbstractComponent';

type TKind<T extends typeof AbstractListenerComponent> = ReturnType<
	ReturnType<
		NonNullable<
			ReturnType<T['ClassToListenerKindToListenerKeys']['get']>
		>['keys']
	>['next']
>['value'];

export abstract class AbstractListenerComponent extends AbstractComponent {
	public static ClassToListenerKindToListenerKeys = new Map<
		Function,
		Map<any, string[]>
	>();

	public listenerKindToListenerKeys: Map<any, string[]>;

	constructor(entity: AbstractEntity) {
		super(entity);

		let prototype: any = this.entity.constructor;

		do {
			const listenerKindToListenerKeys = (
				this.constructor as typeof AbstractListenerComponent
			).ClassToListenerKindToListenerKeys.get(prototype);

			if (listenerKindToListenerKeys) {
				this.listenerKindToListenerKeys = listenerKindToListenerKeys;

				break;
			}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		} while ((prototype = Object.getPrototypeOf(prototype)));

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		if (!this!.listenerKindToListenerKeys)
			throw new IllegalStateError('no listeners registered');
	}

	public emit(
		kind: ReturnType<
			NonNullable<
				ReturnType<typeof this['listenerKindToListenerKeys']['keys']>
			>['next']
		>['value'],
		args: any[],
	) {
		const keys = this.listenerKindToListenerKeys.get(kind);

		// @ts-expect-error can't really type this here, but it's enforced elsewhere
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		for (const key of keys) void this.entity[key](...args);
	}

	public static emit<T extends typeof AbstractListenerComponent>(
		this: T,
		Class: Function,
		kind: TKind<T>,
		args: any[],
	) {
		const listenerKindToListenerKeys =
			this.ClassToListenerKindToListenerKeys.get(Class);

		if (!listenerKindToListenerKeys) return;

		const keys = listenerKindToListenerKeys.get(kind);

		// @ts-expect-error can't really type this here, but it's enforced elsewhere
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		for (const key of keys) void this.entity[key](...args);
	}

	public static listener<T extends typeof AbstractListenerComponent>(
		this: T,
		kind: TKind<T>,
	) {
		return (prototype: Function['prototype'], key: string) => {
			let listenerKindToListenerKeys =
				this.ClassToListenerKindToListenerKeys.get(
					prototype.constructor,
				);

			if (!listenerKindToListenerKeys) {
				listenerKindToListenerKeys = new Map();

				this.ClassToListenerKindToListenerKeys.set(
					prototype.constructor,
					listenerKindToListenerKeys,
				);
			}

			let listenerKeys = listenerKindToListenerKeys.get(kind);

			if (!listenerKeys) {
				listenerKeys = [];

				listenerKindToListenerKeys.set(kind, listenerKeys);
			}

			listenerKeys.push(key);
		};
	}
}
