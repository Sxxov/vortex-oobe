import { GameStates } from '../../GameStates';
import { AbstractComponent } from '../common/AbstractComponent';

export class EndingTriggerComponent extends AbstractComponent {
	public endIfSufficientXp() {
		if (this.entity.round.game.xps.value.some((v) => v >= 20)) this.end();
	}

	public end() {
		const { xps, state } = this.entity.round.game;

		const maxXpIndex = xps.reduce(
			(prevMaxI, currNum, i, arr) =>
				currNum > arr[prevMaxI] ? i : prevMaxI,
			0,
		);

		switch (maxXpIndex) {
			case 0:
				state.set(GameStates.POSTGAME_PEDOPHILIC);
				break;
			case 1:
				state.set(GameStates.POSTGAME_HOMICIDAL);
				break;
			case 2:
				state.set(GameStates.POSTGAME_SUICIDAL);
				break;
			default:
		}
	}
}
