import { Store } from '../../../blocks/store';
import { AbstractComponent } from '../AbstractComponent';

export class PlayerNearComponent extends AbstractComponent {
	public isNear = new Store(false);
}
