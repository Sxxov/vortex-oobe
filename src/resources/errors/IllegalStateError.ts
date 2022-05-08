import { ClientError } from './ClientError';

export class IllegalStateError extends ClientError {
	constructor(message: string) {
		super(`Illegal state${message ? `: ${message}` : ''}`);
	}
}
