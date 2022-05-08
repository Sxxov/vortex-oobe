import type { TImport } from '../blocks/types/TImport';

export class Importer {
	public static async default<T>(
		imported: TImport<T> | Promise<TImport<T>>,
	): Promise<T> {
		if ((imported as Promise<T>).then) {
			const awaited = await imported;

			return (awaited as { default: T }).default ?? (awaited as T);
		}

		return imported as T;
	}
}
