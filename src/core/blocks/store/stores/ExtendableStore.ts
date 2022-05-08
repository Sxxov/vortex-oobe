import { Store } from '../Store.js';

export class ExtendableStore<T = unknown> extends Store<T> {
	constructor(value: T, isWritable?: boolean) {
		super(value, isWritable);

		const valueDescriptors = Object.getOwnPropertyDescriptors(this.value);
		const prototypeDescriptors = Object.getOwnPropertyDescriptors(
			(this.value as any)?.constructor?.prototype ?? {},
		);
		const descriptors = {
			...prototypeDescriptors,
			...valueDescriptors,
		};

		Object.keys(descriptors).forEach((descriptorKey) => {
			// @ts-expect-error obj[string]
			if (this[descriptorKey] != null) {
				return;
			}

			const {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				value: descriptorValue,
			} = descriptors[descriptorKey];

			descriptors[descriptorKey].value =
				(descriptorValue as (...args: any) => any)?.bind?.(
					this.value,
				) ?? descriptorValue;

			Object.defineProperty(
				this,
				descriptorKey,
				descriptors[descriptorKey],
			);
		});
	}
}
