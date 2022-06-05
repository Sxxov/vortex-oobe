import { ShapedArrayStore } from '../../blocks/store/stores/ShapedArrayStore';
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
import { PlaceholderSprite } from '../sprite/PlaceholderSprite';
import type { TPositionStore } from '../types/TPositionStore';
import type { TScreenPosition } from '../types/TScreenPosition';
import { AbstractEntity } from './AbstractEntity';

export class DoorEntity extends AbstractEntity {
	public static override Components: typeof AbstractEntity['Components'] = [
		DynamicSpriteComponent.for(new PlaceholderSprite(), [2, 1]),
		TouchableComponent,
		ClickableComponent,
		HighlightComponent,
		PlayerNearComponent,
		WallComponent,
		AlertComponent,
	] as const;

	protected isNear = this.component(PlayerNearComponent)!.isNear;

	public override position: TPositionStore = new ShapedArrayStore([2, 31]);

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

		this.round.dream();

		return true;
	}
}
