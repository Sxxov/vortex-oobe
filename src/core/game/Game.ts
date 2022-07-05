import { IllegalStateError } from '../../resources/errors';
import { Store } from '../blocks/store';
import { ArrayStore } from '../blocks/store/stores/ArrayStore';
import type { TUi } from './components/ui/TUi';
import { GameConstants } from './GameConstants';
import { GameStates } from './GameStates';
import { Round } from './round/Round';
import { RoundStore } from './round/RoundStore';
import type { ScreenSpace } from './screen/ScreenSpace';
import { DirtyTeddyBearEntity } from './story/DirtyTeddyBearEntity';
import { ToteBagEntity } from './story/ToteBagEntity';
import { XpStore } from './xp/XpStore';
import { PensAndPaperEntity } from './story/PensAndPaperEntity';
import { DreamInjectionEntity } from './entities/DreamInjectionEntity';
import { NullSprite } from './sprite/NullSprite';

export class Game {
	public uiQueue = new ArrayStore<TUi>();
	public xps = new XpStore();
	public rounds: Round[] = [];
	public round = new RoundStore();
	public state = new Store(GameStates.PREGAME);

	constructor(public screenSpace: ScreenSpace) {
		let hasSusPrompted = false;

		this.xps.subscribeLazy((xps) => {
			if (!hasSusPrompted && xps.some((xp) => xp >= 15)) {
				this.round.value?.entityPool.push(
					new (DreamInjectionEntity.for({
						heading: 'Hmm...',
						message:
							'Dr. Charles has been acting a little weird lately.',
						options: ['continue'],
						sprite: new NullSprite(),
					}))(this.round.value),
				);

				hasSusPrompted = true;
			}
		});
	}

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
			if (round) round.start();
			else this.state.set(GameStates.POSTGAME_FAIL);
		});

		currRound.entityPool.push(
			new DirtyTeddyBearEntity(currRound),
			new ToteBagEntity(currRound),
			new PensAndPaperEntity(currRound),
		);
	}

	public end() {
		this.round.value?.end();
		this.round.set(undefined);
	}
}
