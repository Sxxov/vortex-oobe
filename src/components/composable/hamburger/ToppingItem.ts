import { Item } from '../../../core/blocks/item';

export class ToppingItem extends Item {
	public declare svg: string;
	public declare name: string;
	public declare action: () => void;
}
