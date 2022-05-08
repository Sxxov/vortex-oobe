import { AbstractSpriteComponent } from '../sprites/AbstractSpriteComponent';
import { AbstractUiComponent } from './AbstractUiComponent';
import { UiKinds } from './UiKinds';
import type { IConfirm } from './uis/IConfirm';

export class ConfirmComponent extends AbstractUiComponent {
	public async confirm(
		heading: string,
		message: string,
		options: IConfirm['options'] = ['ok', 'cancel'],
	) {
		return new Promise<NonNullable<IConfirm['result']>>((resolve) => {
			this.assertEntityHas(AbstractSpriteComponent);

			const sprite = this.entity.component(AbstractSpriteComponent)!;
			const confirm: IConfirm = {
				kind: UiKinds.CONFIRM,
				sprite: sprite.sprite.value,
				heading,
				message,
				options,
			};

			const unsubscribe = this.entity.round.game.uiQueue.subscribeLazy(
				(uis) => {
					if (!uis.includes(confirm)) {
						unsubscribe();
						resolve(confirm.result!);
					}
				},
			);

			this.entity.round.game.uiQueue.push(confirm);
		});
	}
}
