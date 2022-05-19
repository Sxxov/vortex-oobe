import { Store } from '../../../blocks/store';
import { AbstractComponent } from '../common/AbstractComponent';

export class CursorComponent extends AbstractComponent {
	public cursor = new Store('');
}
