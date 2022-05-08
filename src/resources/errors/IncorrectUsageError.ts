import { ClientError } from './ClientError';

export class IncorrectUsageError extends ClientError {
	constructor(message: string) {
		super(`Incorrect usage of item${message ? `: ${message}` : ''}`);
	}
}
