import { Sprite } from './Sprite';

export class NullSprite extends Sprite {
	constructor() {
		super(
			'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
		);
	}
}
