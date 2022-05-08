import { AbstractSpriteComponent } from '../sprites/AbstractSpriteComponent';
import { AbstractUiComponent } from './AbstractUiComponent';
import { UiKinds } from './UiKinds';
import type { IPrompt } from './uis/IPrompt';

export class PromptComponent extends AbstractUiComponent {
	public async prompt(
		heading: string,
		message: string,
		options: IPrompt['options'] = ['ok', 'cancel'],
	) {
		return new Promise<NonNullable<IPrompt['result']>>((resolve) => {
			this.assertEntityHas(AbstractSpriteComponent);

			const sprite = this.entity.component(AbstractSpriteComponent)!;
			const prompt: IPrompt = {
				kind: UiKinds.PROMPT,
				sprite: sprite.sprite.value,
				heading,
				message,
				options,
			};

			const unsubscribe = this.entity.round.game.uiQueue.subscribeLazy(
				(uis) => {
					if (!uis.includes(prompt)) {
						unsubscribe();
						resolve(prompt.result!);
					}
				},
			);

			this.entity.round.game.uiQueue.push(prompt);
		});
	}
}
