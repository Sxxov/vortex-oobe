import { Store } from '../blocks/store';
import { ArrayStore } from '../blocks/store/stores/ArrayStore';
import { ShapedArrayStore } from '../blocks/store/stores/ShapedArrayStore';
import { PlayerNearComponent } from './components/highlight/PlayerNearComponent';
import { ClickableComponent } from './components/listeners/clickable/ClickableComponent';
import { ClickableListenerKinds } from './components/listeners/clickable/ClickableListenerKinds';
import { TouchableComponent } from './components/listeners/touchable/TouchableComponent';
import { TouchableListenerKinds } from './components/listeners/touchable/TouchableListenerKinds';
import { AlertComponent } from './components/ui/AlertComponent';
import type { TUi } from './components/ui/TUi';
import { WallComponent } from './components/WallComponent';
import { InteractivePropEntity } from './entities/InteractivePropEntity';
import { GameConstants } from './GameConstants';
import { Round } from './round/Round';
import type { ScreenSpace } from './screen/ScreenSpace';
import { NullSprite } from './sprite/NullSprite';
import { PlaceholderSprite } from './sprite/PlaceholderSprite';
import type { TPositionStore } from './types/TPositionStore';
import type { TScreenPosition } from './types/TScreenPosition';

export class Game {
	public uiQueue = new ArrayStore<TUi>();
	public rounds = new Array<Round>(GameConstants.ROUND_COUNT)
		.fill(undefined as any)
		.map((_, i, arr) => new Round(this, arr[i - 1]));

	public round = new Store(this.rounds[0]);

	constructor(public screenSpace: ScreenSpace) {
		this.round.subscribe((round) => {
			round.populate();
		});

		class TestEntity extends InteractivePropEntity.for(
			new PlaceholderSprite(),
			new NullSprite(),
			[2, 2],
		) {
			public static override Components: typeof InteractivePropEntity['Components'] =
				[...super.Components, WallComponent, AlertComponent] as const;

			public override position: TPositionStore = new ShapedArrayStore([
				Math.floor(Math.random() * 31),
				Math.floor(Math.random() * 31),
			]);

			// @ClickableComponent.listener(ClickableListenerKinds.CLICK)
			protected override async onClick() {
				await super.onClick();

				if (!this.isNear.value) return;

				await this.component(AlertComponent)?.alert(
					'oOoOooOoo',
					'disappear... oOOOOOoOOOOOOOOOOOOO',
				);
			}

			// @TouchableComponent.listener(TouchableListenerKinds.CONFINED)
			protected override async onTouch(
				iter: AsyncIterable<TScreenPosition[]>,
			) {
				await super.onTouch(iter);
			}
		}

		for (let i = 0, l = 32; i < l; ++i)
			this.round.value.entityPool.push(new TestEntity(this.round.value));
	}
}
