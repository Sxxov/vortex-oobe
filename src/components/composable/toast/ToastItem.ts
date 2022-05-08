import { Item } from '../../../core/blocks/item';
import { Level } from '../common/enums/Level';

export class ToastItem extends Item {
	uid? = String(Date.now());
	text = '';
	level?: Level = Level.INFO;
	duration? = 2000;
}
