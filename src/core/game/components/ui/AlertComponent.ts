import { AbstractSpriteComponent } from '../sprites/AbstractSpriteComponent';
import { AbstractUiComponent } from './AbstractUiComponent';
import { UiKinds } from './UiKinds';
import type { IAlert } from './uis/IAlert';

export class AlertComponent extends AbstractUiComponent {
	public async alert(
		heading: string,
		message: string,
		options: IAlert['options'] = ['ok'],
	) {
		return new Promise<NonNullable<IAlert['result']>>((resolve) => {
			this.assertEntityHas(AbstractSpriteComponent);

			const sprite = this.entity.component(AbstractSpriteComponent)!;
			const alert: IAlert = {
				kind: UiKinds.ALERT,
				sprite: sprite.sprite.value,
				heading,
				message,
				options,
			};

			const unsubscribe = this.entity.round.game.uiQueue.subscribeLazy(
				(uis) => {
					if (!uis.includes(alert)) {
						unsubscribe();
						resolve(alert.result!);
					}
				},
			);

			this.entity.round.game.uiQueue.push(alert);
		});
	}
}
