import { Store } from '../../../blocks/store';
import { AbstractComponent } from '../AbstractComponent';
import { HighlightLevels } from './HighlightLevels';

export class HighlightComponent extends AbstractComponent {
	private highlightStack: HighlightLevels[] = [];
	public highlight = new Store(HighlightLevels.NONE);

	public pushHighlight(level: HighlightLevels) {
		this.highlightStack.push(this.highlight.value);

		this.highlight.set(level);
	}

	public popHighlight() {
		const level = this.highlightStack.pop() ?? HighlightLevels.NONE;

		this.highlight.set(level);
	}
}
