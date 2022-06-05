import { ConsumableComponent } from '../components/consumable/ConsumableComponent';
import { DynamicSpriteComponent } from '../components/sprites/DynamicSpriteComponent';
import type { AbstractSprite } from '../sprite/AbstractSprite';
import { AbstractEntity } from './AbstractEntity';
import { ClickableComponent } from '../components/listeners/clickable/ClickableComponent';
import { TouchableComponent } from '../components/listeners/touchable/TouchableComponent';
import type { TScreenPosition } from '../types/TScreenPosition';
import { TouchableListenerKinds } from '../components/listeners/touchable/TouchableListenerKinds';
import { HighlightComponent } from '../components/highlight/HighlightComponent';
import { ClickableListenerKinds } from '../components/listeners/clickable/ClickableListenerKinds';
import type { TCellSize } from '../types/TCellSize';
import { HighlightLevels } from '../components/highlight/HighlightLevels';
import type { TUnabstract } from '../../blocks/types/TUnabstract';
import type { AbstractComponent } from '../components/common/AbstractComponent';
import { PlayerNearComponent } from '../components/highlight/PlayerNearComponent';
import type { Round } from '../round/Round';
import { DreamComponent } from '../components/dream/DreamComponent';
import type { TDream } from '../components/dream/TDream';

export abstract class InteractivePropEntity extends AbstractEntity {
	public static for(
		initialSprite: AbstractSprite,
		consumedSprite: AbstractSprite,
		size: TCellSize,
		dream: TDream,
	) {
		return class extends InteractivePropEntity {
			public static override readonly Components: readonly TUnabstract<
				typeof AbstractComponent
			>[] = [
				DynamicSpriteComponent.for(initialSprite, size),
				TouchableComponent,
				ClickableComponent,
				ConsumableComponent.for(consumedSprite),
				HighlightComponent,
				PlayerNearComponent,
				DreamComponent.for(dream),
			] as const;
		};
	}

	protected isNear = this.component(PlayerNearComponent)!.isNear;

	constructor(round: Round) {
		super(round);

		const highlight = this.component(HighlightComponent)!;

		this.isNear.subscribeLazy((isNear) => {
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

		const consumable = this.component(ConsumableComponent)!;

		consumable.consume();

		return true;
	}
}
