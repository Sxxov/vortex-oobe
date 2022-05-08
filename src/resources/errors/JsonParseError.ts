import { ClientError } from './ClientError';

export class JsonParseError extends ClientError {
	constructor(message?: string) {
		super(`Failed to parse JSON${message ? `: ${message}` : ''}`);
	}
}
