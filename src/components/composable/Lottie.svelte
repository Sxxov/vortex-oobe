<script lang="ts">
	import type { AnimationConfig, AnimationItem } from 'lottie-web';
	import { onMount } from 'svelte';
	import { CssUtility } from '../../resources/utilities';
	import type { Css } from '../../resources/utilities';
	import { LottieSingleton } from '../../core/animator/singletons/LottieSingleton';
	import { readable } from 'svelte/store';

	export let frame = 0;
	export let src = '';
	export let animationData: Record<any, any> | undefined = undefined;
	export let height: Css = '100%';
	export let width: Css = '100%';
	export let options: Pick<
		AnimationConfig<'canvas' | 'svg' | 'html'>,
		Exclude<keyof AnimationConfig, 'container'>
	> = {};
	export let overrideColour: Css = '';

	let setAnimationR: (v: AnimationItem) => void;
	export const animationR = readable<AnimationItem | null>(null, (set) => {
		setAnimationR = set;
	});

	let animation: AnimationItem | undefined;
	let contentDiv: HTMLDivElement;

	$: if (animation) {
		setAnimationR?.(animation);
	}

	$: animation?.goToAndStop(frame, true);

	onMount(async () => {
		await LottieSingleton.loadModule();
		const json =
			(await Promise.resolve(animationData)) ??
			(src ? await (await fetch(src)).json() : {});

		const lottie = LottieSingleton.getInstance();

		if (animation == null) {
			const unloadedAnimation = lottie.loadAnimation({
				animationData: json.default ?? json,
				autoplay: true,
				loop: true,
				...options,
				container: contentDiv,
			});

			unloadedAnimation.addEventListener('DOMLoaded', () => {
				animation = unloadedAnimation;

				unloadedAnimation.removeEventListener('DOMLoaded');
			});
		}
	});
</script>

<div
	type="<Lottie>"
	class="component"
	style="
		--height: {CssUtility.parse(height)};
		--width: {CssUtility.parse(width)};
	"
>
	<div
		class="content"
		bind:this={contentDiv}
		style="
			--fill: {overrideColour ? CssUtility.parse(overrideColour) : 'unset'};
			--stroke: {overrideColour ? CssUtility.parse(overrideColour) : 'unset'};
		"
		class:unloaded={animation == null}
	/>
</div>

<style lang="postcss">
	.component {
		height: var(--height);
		width: var(--width);

		overflow: hidden;
	}

	.content {
		opacity: 1;

		transition: opacity 0.3s theme('ease.slowSlow');

		fill: var(--fill);
		stroke: var(--stroke);

		&.unloaded {
			opacity: 0;
		}
	}
</style>
