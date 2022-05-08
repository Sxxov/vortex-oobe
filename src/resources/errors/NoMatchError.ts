import { ClientError } from './ClientError';

export class NoMatchError extends ClientError {
	constructor(message?: string) {
		super(`No match was found${message ? `: ${message}` : ''}`);
	}
}
