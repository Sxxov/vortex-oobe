import { quintInOut } from 'svelte/easing';
import { Item } from '../blocks/item';

export type TTransitionCssString = string;

export class TransitionerResultItem extends Item {
	public delay = 0;
	public duration = 200;
	public easing = quintInOut;
	public declare css: (
		time: number,
		invertedTime: number,
	) => TTransitionCssString;

	public tick?: ((time: number, invertedTime: number) => void) | undefined;
}
