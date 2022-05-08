/** Binds `this` to the method's class on first access */
export function bound(prototype: any, key: string, desc: PropertyDescriptor) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const v: any = desc.value;

	delete desc.value;
	delete desc.writable;
	desc.get = function (this: any) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
		desc.value = v.bind(this);

		delete desc.get;

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return desc.value;
	};
}
