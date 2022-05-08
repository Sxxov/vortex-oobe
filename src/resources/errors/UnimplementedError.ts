import { ClientError } from './ClientError';

export class UnimplementedError extends ClientError {
	constructor(message?: string) {
		super(`Unimplemented${message ? `: ${message}` : ''}`);
	}
}
