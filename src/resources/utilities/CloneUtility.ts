/*
	eslint-disable
		@typescript-eslint/no-unsafe-assignment,
		@typescript-eslint/no-unsafe-return,
		@typescript-eslint/no-unsafe-call
*/
export class CloneUtility {
	// yanked from https://stackoverflow.com/a/40294058
	public static deep<T extends Record<any, any>>(
		obj: T,
		hash = new WeakMap(),
	): T {
		if (Object(obj) !== obj) {
			return obj;
		} // primitives

		if (hash.has(obj)) {
			return hash.get(obj);
		} // cyclic reference

		const result: T =
			obj instanceof Set
				? new Set(obj) // See note about this!
				: obj instanceof Map
				? new Map(
						Array.from(obj, ([key, val]) => [
							key,
							CloneUtility.deep(val, hash),
						]),
				  )
				: obj instanceof Date
				? new Date(obj)
				: obj instanceof RegExp
				? new RegExp(obj.source, obj.flags)
				: // ... add here any specific treatment for other classes ...
				// and finally a catch-all:
				obj.constructor
				? new (obj as any).constructor()
				: Object.create(null);
		hash.set(obj, result);

		return Object.assign(
			result,
			...Object.keys(obj).map((key) => ({
				[key]: CloneUtility.deep(obj[key], hash),
			})),
		);
	}
}
