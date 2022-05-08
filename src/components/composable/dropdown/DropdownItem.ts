import type { Css } from '../../../resources/utilities';
import { Item } from '../../../core/blocks/item';
import { RandomUtility } from '../../../resources/utilities';

export class DropdownItem extends Item {
	public declare text: string;
	public declare svg: string | Promise<string> | Promise<unknown>;
	public label? = false;
	public id? = RandomUtility.string();
	public backgroundColour?: Css = '--colour-text-primary';
	public hoverBackgroundColour?: Css = '--colour-text-secondary';
	public rippleColour?: Css = '--colour-background-secondary';
	public textColour?: Css = '--colour-background-primary';
}
