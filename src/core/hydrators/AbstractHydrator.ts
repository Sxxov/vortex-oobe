import { IllegalArgumentError } from '../../resources/errors';

type TObj = Record<string | number | symbol, any>;

export abstract class AbstractHydrator<T extends TObj = TObj> {
	protected static readonly BRAND_SYMBOL = Symbol('Hydratol symbol');

	constructor(protected out: T, isForceHydrating = false) {
		if (AbstractHydrator.isHydrated(out) && !isForceHydrating) {
			throw new IllegalArgumentError(
				'Object has already been hydrated (try passing in `true` into the 2nd param to force hydration)',
				'out',
			);
		}
	}

	public abstract hydrate(): Promise<void>;

	public static isHydrated(target: TObj) {
		return target[AbstractHydrator.BRAND_SYMBOL] === this.constructor.name;
	}

	protected brand() {
		// @ts-expect-error we're hijacking `this.out`, but it's a symbol so it's probably fine??
		this.out[AbstractHydrator.BRAND_SYMBOL] = this.constructor.name;
	}
}
