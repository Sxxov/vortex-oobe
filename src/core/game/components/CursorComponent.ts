import { Store } from '../../blocks/store';
import { AbstractComponent } from './AbstractComponent';

export class CursorComponent extends AbstractComponent {
	public cursor = new Store('');
}
