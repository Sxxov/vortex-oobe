import { AbstractComponent } from '../common/AbstractComponent';

export class EndingTriggerComponent extends AbstractComponent {
	public endIfSufficientXp() {
		if (this.entity.round.game.xps.some((v) => v >= 20)) this.end();
	}

	public end() {}
}
