import { IllegalStateError } from '../../resources/errors';
import { Store } from '../blocks/store';
import { ArrayStore } from '../blocks/store/stores/ArrayStore';
import { ShapedArrayStore } from '../blocks/store/stores/ShapedArrayStore';
import type { TUi } from './components/ui/TUi';
import { GameConstants } from './GameConstants';
import { GameStates } from './GameStates';
import { Round } from './round/Round';
import type { ScreenSpace } from './screen/ScreenSpace';
import { DirtyTeddyBearEntity } from './story/DirtyTeddyBearEntity';
import type { TXps } from './xp/TXps';

export class Game {
	public uiQueue = new ArrayStore<TUi>();
	public xps = new ShapedArrayStore<TXps>([0, 0, 0]);
	public rounds: Round[] = [];
	public round = new Store<Round | undefined>(undefined);
	public state = new Store(GameStates.PREGAME);

	constructor(public screenSpace: ScreenSpace) {}

	public start() {
		this.state.set(GameStates.GAME);

		let prevRound: Round | undefined;
		let currRound: Round | undefined;
		for (let i = 0, l = GameConstants.ROUND_COUNT; i < l; ++i) {
			this.rounds.push(
				(currRound = new Round(this, prevRound, currRound)),
			);
		}

		if (!currRound)
			throw new IllegalStateError(
				'Attempted to start game with no rounds',
			);

		this.round.set(currRound);
		this.round.subscribe((round) => {
			if (round) round.populate();
			else this.state.set(GameStates.POSTGAME_FAIL);
		});

		currRound.entityPool.push(
			new DirtyTeddyBearEntity(currRound),
			// new ToteBagEntity(currRound),
		);
	}

	public end() {
		this.round.set(undefined);
	}
}
