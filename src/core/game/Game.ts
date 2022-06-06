import { Store } from '../blocks/store';
import { ArrayStore } from '../blocks/store/stores/ArrayStore';
import type { TUi } from './components/ui/TUi';
import { GameConstants } from './GameConstants';
import { Round } from './round/Round';
import type { ScreenSpace } from './screen/ScreenSpace';
import { DirtyTeddyBearEntity } from './story/DirtyTeddyBearEntity';
import { ToteBagEntity } from './story/ToteBagEntity';

export class Game {
	public uiQueue = new ArrayStore<TUi>();
	public rounds: Round[] = [];
	public round: Store<Round>;

	constructor(public screenSpace: ScreenSpace) {
		let prevRound: Round | undefined;
		let currRound: Round | undefined;
		for (let i = 0, l = GameConstants.ROUND_COUNT; i < l; ++i) {
			this.rounds.push(
				(currRound = new Round(this, prevRound, currRound)),
			);
		}

		this.round = new Store(currRound!);
		this.round.subscribe((round) => {
			round.populate();
		});

		this.round.value.entityPool.push(
			new DirtyTeddyBearEntity(this.round.value),
			new ToteBagEntity(this.round.value),
		);
	}

	public proceedToNextRound() {
		if (this.round.value.next) this.round.set(this.round.value.next);
	}
}
