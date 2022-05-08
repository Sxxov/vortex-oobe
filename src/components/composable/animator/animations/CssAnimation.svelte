<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Animator } from '../../../../core/animator';
	import { WhenNotAnimatingBehaviour } from '../../../../core/animator/animations/AbstractElementAnimation';
	import { CssAnimation } from '../../../../core/animator/animations/CssAnimation';
	import { WalkUtility } from '../../../../resources/utilities';

	export let animator: Animator;
	export let inFrame: CssAnimation['in'];
	export let length: CssAnimation['length'];
	export let property: CssAnimation['property'];
	export let value: CssAnimation['value'];
	export let whenNotAnimating: CssAnimation['whenNotAnimating'] =
		WhenNotAnimatingBehaviour.SHOW;
	export let delayPerNode = 0;

	let container: HTMLDivElement;
	let i = 0;

	onMount(() => {
		WalkUtility.walkAlongChildren(container, 'childNodes', (node) => {
			if (node instanceof HTMLElement) {
				const { display } = getComputedStyle(node);

				if (display !== 'contents') {
					animator.add(
						CssAnimation.from({
							elem: node,
							in: inFrame + i++ * delayPerNode,
							length,
							property,
							value,
							whenNotAnimating,
						}),
					);

					return false;
				}
			}

			return true;
		});
	});

	onDestroy(() => {
		animator.composition.destroy();
	});
</script>

<div type="<CssAnimation>" class="component" bind:this={container}>
	<slot />
</div>

<style>
	.component {
		display: contents;
	}
</style>
