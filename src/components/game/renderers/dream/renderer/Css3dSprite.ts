import { Css3dObject } from './Css3dObject';

export class Css3dSprite extends Css3dObject {
	public rotation2d = 0;

	public override copy(source: this, recursive?: boolean) {
		super.copy(source, recursive);

		this.rotation2d = source.rotation2d;

		return this;
	}
}
