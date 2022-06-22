import { ShapedArrayStore } from '../../blocks/store/stores/ShapedArrayStore';
import type { TUnabstract } from '../../blocks/types/TUnabstract';
import type { AbstractComponent } from '../components/common/AbstractComponent';
import { ConsumableComponent } from '../components/consumable/ConsumableComponent';
import { DreamComponent } from '../components/dream/DreamComponent';
import type { IDream } from '../components/dream/IDream';
import { EndingTriggerComponent } from '../components/ending/EndingTriggerComponent';
import { HighlightComponent } from '../components/highlight/HighlightComponent';
import { HighlightLevels } from '../components/highlight/HighlightLevels';
import { PlayerNearComponent } from '../components/highlight/PlayerNearComponent';
import { ClickableComponent } from '../components/listeners/clickable/ClickableComponent';
import { ClickableListenerKinds } from '../components/listeners/clickable/ClickableListenerKinds';
import { TouchableComponent } from '../components/listeners/touchable/TouchableComponent';
import { TouchableListenerKinds } from '../components/listeners/touchable/TouchableListenerKinds';
import { DynamicSpriteComponent } from '../components/sprites/DynamicSpriteComponent';
import { AlertComponent } from '../components/ui/AlertComponent';
import { WallComponent } from '../components/wall/WallComponent';
import type { Round } from '../round/Round';
import type { Sprite } from '../sprite/Sprite';
import type { TCellRect } from '../types/TCellRect';
import type { TPositionStore } from '../types/TPositionStore';
import type { TScreenPosition } from '../types/TScreenPosition';
import type { TXps } from '../xp/TXps';
import { AbstractEntity } from './AbstractEntity';

export abstract class InteractivePropEntity extends AbstractEntity {
	public static for(
		initialSprite: Sprite,
		consumedSprite: Sprite,
		xywh: TCellRect,
		dream: IDream,
		points: TXps,
		canEndGame = false,
	) {
		return class extends InteractivePropEntity {
			public static override readonly Components: readonly TUnabstract<
				typeof AbstractComponent
			>[] = [
				AlertComponent,
				WallComponent,
				DynamicSpriteComponent.for(initialSprite, [xywh[2], xywh[3]]),
				TouchableComponent,
				ClickableComponent,
				ConsumableComponent.for(consumedSprite),
				HighlightComponent,
				PlayerNearComponent,
				DreamComponent.for(dream),
				...(canEndGame ? [EndingTriggerComponent] : []),
			] as const;

			protected points = points;
			public override position: TPositionStore = new ShapedArrayStore([
				xywh[0],
				xywh[1],
			]);
		};
	}

	protected abstract points: TXps;
	protected isNear = this.component(PlayerNearComponent)!.isNear;
	protected consumable = this.component(ConsumableComponent)!;
	protected endingTrigger = this.component(EndingTriggerComponent);

	protected get shouldHighlightOnNear() {
		return !(
			this.consumable.isConsumed.value &&
			this.onConsumedInteraction ===
				InteractivePropEntity.prototype.onConsumedInteraction
		);
	}

	constructor(round: Round) {
		super(round);

		const highlight = this.component(HighlightComponent)!;

		this.isNear.subscribeLazy((isNear) => {
			if (this.shouldHighlightOnNear)
				if (isNear) highlight.pushHighlight(HighlightLevels.LOW);
				else highlight.popHighlight();
		});
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

		if (this.consumable.isConsumed.value) {
			await this.onConsumedInteraction();
		} else {
			await this.onUnconsumedInteraction();
			this.consumable.consume();
			this.round.game.xps.update(
				(oldXps) =>
					oldXps.map((oldXp, i) => oldXp + this.points[i]) as TXps,
			);
			console.log(this.endingTrigger, this.round.game.xps);
			this.endingTrigger?.endIfSufficientXp();
		}

		return true;
	}

	protected async onUnconsumedInteraction() {}
	protected async onConsumedInteraction() {}
}
