import ellis from '../../../assets/img/sprites/ellis =D.png';
import { CursorComponent } from '../components/cursor/CursorComponent';
import { HighlightComponent } from '../components/highlight/HighlightComponent';
import { HighlightLevels } from '../components/highlight/HighlightLevels';
import { PlayerNearComponent } from '../components/highlight/PlayerNearComponent';
import { ClickableComponent } from '../components/listeners/clickable/ClickableComponent';
import { ClickableListenerKinds } from '../components/listeners/clickable/ClickableListenerKinds';
import { TouchableComponent } from '../components/listeners/touchable/TouchableComponent';
import { TouchableListenerKinds } from '../components/listeners/touchable/TouchableListenerKinds';
import { FacingSpriteComponent } from '../components/sprites/FacingSpriteComponent';
import { AlertComponent } from '../components/ui/AlertComponent';
import { WalkComponent } from '../components/walk/WalkComponent';
import { ZindexComponent } from '../components/zindex/ZindexComponent';
import { GameConstants } from '../GameConstants';
import type { Round } from '../round/Round';
import { Sprite } from '../sprite/Sprite';
import type { TScreenPosition } from '../types/TScreenPosition';
import { AbstractEntity } from './AbstractEntity';

export class PlayerEntity extends AbstractEntity {
	public static override readonly Components = [
		FacingSpriteComponent.for(
			[
				new Sprite(ellis),
				new Sprite(ellis),
				new Sprite(ellis),
				new Sprite(ellis),
			],
			[2, 4],
		),
		TouchableComponent,
		ClickableComponent,
		HighlightComponent,
		WalkComponent,
		CursorComponent,
		AlertComponent,
		ZindexComponent.for(10),
	] as const;

	private walk = this.component(WalkComponent)!;
	private highlight = this.component(HighlightComponent)!;
	private cursor = this.component(CursorComponent)!;

	public declare position;

	constructor(round: Round) {
		super(round);

		this.position.set([6, GameConstants.GRID_ROW_COUNT - 4]);

		this.highlight.pushHighlight(HighlightLevels.LOW);

		this.position.subscribe(() => {
			for (const [
				entity,
				distance,
			] of this.surroundingEntityAndDistances()) {
				const playerNearAutoHighlight =
					entity.component(PlayerNearComponent);

				if (playerNearAutoHighlight)
					playerNearAutoHighlight.isNear.set(distance < 4);
			}
		});
	}

	@TouchableComponent.listener(TouchableListenerKinds.UNCONFINED)
	private async onTouch(iter: IterableIterator<TScreenPosition[]>) {
		this.highlight.pushHighlight(HighlightLevels.HIGH);
		this.cursor.cursor.set('crosshair');

		for await (const screenPositions of iter) {
			void this.walk.walk(
				this.round.game.screenSpace.screenPositionToPosition(
					screenPositions[0],
				),
			);
		}

		this.highlight.popHighlight();
		this.cursor.cursor.set('');
	}

	@ClickableComponent.listener(ClickableListenerKinds.CLICK)
	private async onClick() {}
}
