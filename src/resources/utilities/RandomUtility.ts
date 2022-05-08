type TKeyOrIndexOf<T extends Record<any, any>> = T extends any[]
	? number
	: keyof T;
type TPassthroughRecord<T extends Record<any, any>> = Record<
	TKeyOrIndexOf<T>,
	T[TKeyOrIndexOf<T>]
>;

export class RandomUtility {
	public static int(length = 16): number {
		return Number(
			new Array(length)
				.fill(null)
				.map(() => String(Math.floor(Math.min(Math.random() * 10, 9))))
				.join(''),
		);
	}

	public static string(
		length = 16,
		charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
	): string {
		let result = '';
		const { length: charsetLength } = charset;

		for (let i = 0; i < length; i++) {
			result += charset.charAt(Math.floor(Math.random() * charsetLength));
		}

		return result;
	}

	public static value<T extends TPassthroughRecord<T>>(obj: T): T[keyof T] {
		return obj[this.key(obj)];
	}

	public static key<T extends Record<string | number | symbol, any>>(
		obj: T,
	): keyof T {
		if (obj instanceof Array) {
			return Math.floor(Math.random() * obj.length);
		}

		const keys = Object.keys(obj);

		return keys[Math.floor(Math.random() * keys.length)];
	}
}
