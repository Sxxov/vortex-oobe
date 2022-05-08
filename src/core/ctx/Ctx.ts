import { Store } from '../blocks/store';
import type { TStorify } from '../blocks/store';
import type { ToastItem } from '../../components/composable/toast/ToastItem';
import type { ToppingItem } from '../../components/composable/hamburger/ToppingItem';
import { ArrayStore } from '../blocks/store/stores/ArrayStore';

function contextual(target: typeof Contexts, name: keyof typeof Ctx.s): void {
	// no need to define extra setter (like set/get decorators)
	// to capture initialization as this is used on static values,
	// which will be initialized before this decorator is called

	Ctx.s[name] = new Store<any>(target[name]);

	Object.defineProperty(Ctx, name, {
		set(v) {
			(Ctx.s[name] as Store<any>).set(v);
		},
		get() {
			return Ctx.s[name].value;
		},
	});
}

type TCtxStoreMap = {
	[Q in Exclude<keyof typeof Contexts, 'prototype'>]: TStorify<
		typeof Contexts[Q]
	>;
};

// @ts-expect-error props will be initialized later
export const Ctx: {
	s: TCtxStoreMap;
} & Pick<typeof Contexts, Exclude<keyof typeof Contexts, 'prototype'>> = {
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	s: {} as TCtxStoreMap,
};

export class Contexts {
	@contextual public static toasts = new ArrayStore<ToastItem>();
	@contextual public static toppings = new ArrayStore<ToppingItem>();
}
