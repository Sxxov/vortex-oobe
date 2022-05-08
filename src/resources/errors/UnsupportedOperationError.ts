import { ClientError } from './ClientError';

export class UnsupportedOperationError extends ClientError {
	constructor(message: string) {
		super(
			`Attempted to execute an unsupported operation${
				message ? `: ${message}` : ''
			}`,
		);
	}
}
