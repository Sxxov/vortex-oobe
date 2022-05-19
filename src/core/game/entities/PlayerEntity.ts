import { FacingSpriteComponent } from '../components/sprites/FacingSpriteComponent';
import { TouchableComponent } from '../components/listeners/touchable/TouchableComponent';
import { TouchableListenerKinds } from '../components/listeners/touchable/TouchableListenerKinds';
import { WalkComponent } from '../components/walk/WalkComponent';
import { ZindexComponent } from '../components/zindex/ZindexComponent';
import { PlaceholderSprite } from '../sprite/PlaceholderSprite';
import type { TScreenPosition } from '../types/TScreenPosition';
import { AbstractEntity } from './AbstractEntity';
import { ClickableComponent } from '../components/listeners/clickable/ClickableComponent';
import { HighlightComponent } from '../components/highlight/HighlightComponent';
import { ClickableListenerKinds } from '../components/listeners/clickable/ClickableListenerKinds';
import { CursorComponent } from '../components/cursor/CursorComponent';
import { HighlightLevels } from '../components/highlight/HighlightLevels';
import type { Round } from '../round/Round';
import { AlertComponent } from '../components/ui/AlertComponent';
import { PlayerNearComponent } from '../components/highlight/PlayerNearComponent';

export class PlayerEntity extends AbstractEntity {
	public static override readonly Components = [
		FacingSpriteComponent.for(
			[
				new PlaceholderSprite(),
				new PlaceholderSprite(),
				new PlaceholderSprite(),
				new PlaceholderSprite(),
			],
			[2, 2],
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

	constructor(round: Round) {
		super(round);

		this.component(HighlightComponent)?.pushHighlight(HighlightLevels.LOW);

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
		const highlight = this.component(HighlightComponent)!;
		const cursor = this.component(CursorComponent)!;

		highlight.pushHighlight(HighlightLevels.HIGH);
		cursor.cursor.set('crosshair');

		for await (const screenPositions of iter) {
			void this.walk.walk(
				this.round.game.screenSpace.screenPositionToPosition(
					screenPositions[0],
				),
			);
		}

		highlight.popHighlight();
		cursor.cursor.set('');
	}

	@ClickableComponent.listener(ClickableListenerKinds.CLICK)
	private async onClick() {
		await this.component(AlertComponent)?.alert('ket', 'nyaaa');
	}
}
