import { ClientError } from './ClientError';

export class UnexpectedValueError extends ClientError {
	constructor(message: string) {
		super(
			`An unexpected value was encountered${
				message ? `: ${message}` : ''
			}`,
		);
	}
}
