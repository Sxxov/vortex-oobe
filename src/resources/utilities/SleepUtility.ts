import { IncorrectUsageError } from '../errors/IncorrectUsageError';

export class SleepUtility {
	public static async sleep(ms = 0): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

	public static sleepSync(ms: number): void {
		try {
			Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 1, ms);
		} catch (_: unknown) {
			throw new IncorrectUsageError(
				'sleepSync() can only be used in later versions of node & web workers. (not on web main thread!)',
			);
		}
	}
}
