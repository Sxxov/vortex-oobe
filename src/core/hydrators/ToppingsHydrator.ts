import { ToppingItem } from '../../components/composable/hamburger/ToppingItem';
import { AbstractHydrator } from './AbstractHydrator';
import {
	home,
	face,
	visibility,
	call,
} from '!i/twotone::home,face,visibility,call';

export class ToppingsHydrator extends AbstractHydrator<ToppingItem[]> {
	constructor(
		out: ToppingItem[],
		private goto: (href: string, opts?: any) => Promise<void>,
	) {
		super(out);
	}

	/** @stub */
	public async hydrate() {
		this.out[0] = ToppingItem.from({
			svg: home,
			name: 'Home'.toUpperCase(),
			action: () => {
				void this.goto('/');
			},
		});
		this.out[1] = ToppingItem.from({
			svg: face,
			name: 'About'.toUpperCase(),
			action: () => {
				void this.goto('/about');
			},
		});
		this.out[2] = ToppingItem.from({
			svg: visibility,
			name: 'Portfolio'.toUpperCase(),
			action: () => {
				void this.goto('/portfolio');
			},
		});
		this.out[3] = ToppingItem.from({
			svg: call,
			name: 'Contact'.toUpperCase(),
			action: () => {
				void this.goto('/contact');
			},
		});

		this.brand();
	}
}
