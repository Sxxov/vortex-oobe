import { Object3D } from 'three';

export class Css3dObject extends Object3D {
	constructor(public element: HTMLElement = document.createElement('div')) {
		super();

		this.element.style.position = 'absolute';
		this.element.style.pointerEvents = 'auto';
		this.element.style.userSelect = 'none';

		this.element.setAttribute('draggable', 'false');

		this.addEventListener('removed', () => {
			this.traverse(() => {
				if (
					this.element instanceof Element &&
					this.element.parentNode !== null
				) {
					this.element.parentNode.removeChild(this.element);
				}
			});
		});
	}

	public override copy(source: this, recursive?: boolean) {
		super.copy(source, recursive);

		this.element = source.element.cloneNode(true) as HTMLDivElement;

		return this;
	}
}
