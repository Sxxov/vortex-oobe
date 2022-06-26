import doorClosed from '../../../assets/img/sprites/door, closed.png';
import doorOpened from '../../../assets/img/sprites/door, opened.png';
import { HighlightComponent } from '../components/highlight/HighlightComponent';
import { HighlightLevels } from '../components/highlight/HighlightLevels';
import { PlayerNearComponent } from '../components/highlight/PlayerNearComponent';
import { ClickableComponent } from '../components/listeners/clickable/ClickableComponent';
import { ClickableListenerKinds } from '../components/listeners/clickable/ClickableListenerKinds';
import { TouchableComponent } from '../components/listeners/touchable/TouchableComponent';
import { TouchableListenerKinds } from '../components/listeners/touchable/TouchableListenerKinds';
import { DynamicSpriteComponent } from '../components/sprites/DynamicSpriteComponent';
import { AlertComponent } from '../components/ui/AlertComponent';
import { ZindexComponent } from '../components/zindex/ZindexComponent';
import { GameConstants } from '../GameConstants';
import type { Round } from '../round/Round';
import { Sprite } from '../sprite/Sprite';
import type { TScreenPosition } from '../types/TScreenPosition';
import { AbstractEntity } from './AbstractEntity';

export class DoorEntity extends AbstractEntity {
	private static readonly DoorClosedSprite = new Sprite(doorClosed);
	private static readonly DoorOpenedSprite = new Sprite(doorOpened);

	public static override Components: typeof AbstractEntity['Components'] = [
		DynamicSpriteComponent.for(this.DoorClosedSprite, [4.4, 7.2]),
		TouchableComponent,
		ClickableComponent,
		HighlightComponent,
		PlayerNearComponent,
		AlertComponent,
		ZindexComponent.for(11),
	] as const;

	protected isNear = this.component(PlayerNearComponent)!.isNear;
	protected sprite = this.component(DynamicSpriteComponent)!;

	constructor(round: Round) {
		super(round);

		this.position.set([4.45, GameConstants.GRID_ROW_COUNT - 7.2]);

		const highlight = this.component(HighlightComponent)!;

		this.onDoorOpened();

		this.isNear.subscribeLazy((isNear) => {
			if (isNear) {
				highlight.pushHighlight(HighlightLevels.LOW);
				this.onDoorOpened();
			} else {
				highlight.popHighlight();
				this.onDoorClosed();
			}
		});
	}

	private onDoorOpened() {
		this.sprite.sprite.set(DoorEntity.DoorOpenedSprite);
	}

	private onDoorClosed() {
		this.sprite.sprite.set(DoorEntity.DoorClosedSprite);
	}

	@TouchableComponent.listener(TouchableListenerKinds.CONFINED)
	protected async onTouch(iter: AsyncIterable<TScreenPosition[]>) {
		if (!this.isNear.value) return false;

		const highlight = this.component(HighlightComponent)!;

		highlight.pushHighlight(HighlightLevels.HIGH);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
		for await (const _ of iter);

		highlight.popHighlight();

		return true;
	}

	@ClickableComponent.listener(ClickableListenerKinds.CLICK)
	protected async onClick() {
		if (!this.isNear.value) return false;

		this.round.dream();

		return true;
	}
}
