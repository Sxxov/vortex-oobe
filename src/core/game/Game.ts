import { Store } from '../blocks/store';
import { ArrayStore } from '../blocks/store/stores/ArrayStore';
import { ShapedArrayStore } from '../blocks/store/stores/ShapedArrayStore';
import { AlertComponent } from './components/ui/AlertComponent';
import type { TUi } from './components/ui/TUi';
import { WallComponent } from './components/wall/WallComponent';
import { InteractivePropEntity } from './entities/InteractivePropEntity';
import { GameConstants } from './GameConstants';
import { Round } from './round/Round';
import type { ScreenSpace } from './screen/ScreenSpace';
import { NullSprite } from './sprite/NullSprite';
import { PlaceholderSprite } from './sprite/PlaceholderSprite';
import type { TPositionStore } from './types/TPositionStore';

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

		class TestEntity extends InteractivePropEntity.for(
			new PlaceholderSprite(),
			new NullSprite(),
			[2, 2],
			{
				heading: 'bruh',
				message: 'bruhhhhh',
				sprite: new PlaceholderSprite(),
				options: ['bruhhhhhhhhh'],
			},
		) {
			public static override Components: typeof InteractivePropEntity['Components'] =
				[...super.Components, WallComponent, AlertComponent] as const;

			public override position: TPositionStore = new ShapedArrayStore([
				Math.floor(Math.random() * 31),
				Math.floor(Math.random() * 31),
			]);

			protected override async onClick() {
				if (!(await super.onClick())) return false;

				await this.component(AlertComponent)?.alert(
					'oOoOooOoo',
					'disappear... oOOOOOoOOOOOOOOOOOOO',
				);

				return true;
			}
		}

		for (let i = 0, l = 32; i < l; ++i)
			this.round.value.entityPool.push(new TestEntity(this.round.value));
	}

	public proceedToNextRound() {
		if (this.round.value.next) this.round.set(this.round.value.next);
	}
}
