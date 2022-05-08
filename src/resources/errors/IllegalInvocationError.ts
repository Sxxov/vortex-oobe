import { ClientError } from './ClientError';

export class IllegalInvocationError extends ClientError {
	constructor(message: string, methodName?: string) {
		super(
			`Illegal invocation${methodName ? ` (to ${methodName})` : ''}${
				message ? `: ${message}` : ''
			}`,
		);
	}
}
