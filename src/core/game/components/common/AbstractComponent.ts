import { IncorrectUsageError } from '../../../../resources/errors';
import type { AbstractEntity } from '../../entities/AbstractEntity';

export abstract class AbstractComponent {
	constructor(public entity: AbstractEntity) {}

	public assertEntityHas(Component: typeof AbstractComponent): void | never {
		if (
			!(this.entity.constructor as typeof AbstractEntity).component(
				Component,
			)
		)
			throw new IncorrectUsageError(
				`attempted to construct ${this.constructor.name} on entity without ${Component.name}`,
			);
	}
}
