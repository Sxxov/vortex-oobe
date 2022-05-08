type TIfEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends <
	T,
>() => T extends Y ? 1 : 2
	? A
	: B;
type TWritableProps<T> = Pick<
	T,
	{
		[P in keyof T]: TIfEquals<
			{ [Q in P]: T[P] },
			{ -readonly [Q in P]: T[P] },
			P,
			never
		>;
	}[keyof T]
>;
export type TItemOptions<T extends abstract new (...args: any[]) => any> = {
	[Q in keyof TWritableProps<InstanceType<T>>]: InstanceType<T>[Q];
};

export class Item {
	/** @deprecated You're probably looking for `Item.from()` */
	constructor() {}

	public static from<T extends typeof Item>(
		this: T,
		// use this adapter type instead of just `InstanceType<T>`
		// to hide protected types & `toString`
		options: TItemOptions<T>,
	): InstanceType<T> {
		const instance = new this();

		Object.assign(instance, options);

		return instance as InstanceType<T>;
	}
}

export abstract class Factory<T extends Item> {
	public abstract create(): T | Promise<T>;
}
