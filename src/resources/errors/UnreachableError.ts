import { ClientError } from './ClientError';

export class UnreachableError extends ClientError {
	constructor(message?: string) {
		super(
			`Somehow, you're in an unreachable part of code${
				message ? `: ${message}` : ''
			}`,
		);
	}
}
