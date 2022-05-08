<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '../Button.svelte';
	import { CssUtility } from '../../../resources/utilities';
	import type { Css } from '../../../resources/utilities';

	export let svgHeight = '1rem';
	export let svgWidth = '1rem';

	export let src = '';
	export let svg: string | Promise<string> | Promise<unknown> = '';
	export let svgColour: Css = '--colour-accent-primary';
	export let hoverSvgColour: Css = svgColour;
	export let isClickable = true;

	const dispatch = createEventDispatcher();

	let div: HTMLDivElement;

	$: if (src) {
		svg = (async () => (await fetch(src)).text())();
	}

	$: if ((svg as Promise<string>).then) {
		void (svg as Promise<string>).then((resolved) => {
			svg = (resolved as any)?.default ?? resolved;
		});
	}

	$: if (div && typeof svg === 'string') {
		div.innerHTML = svg ?? '';

		const svgElem = div.children[0] as SVGElement;

		if (svgElem) {
			svgElem.style.height = CssUtility.parse(svgHeight);
			svgElem.style.width = CssUtility.parse(svgWidth);
		}
	}
</script>

<div type="<SvgButton>" class="component">
	{#if isClickable}
		<Button
			isIconSpacerEnabledOverride={Boolean($$slots.default)}
			{...$$restProps}
			on:click={() => dispatch('click')}
			let:isAnimated
			let:isDisabled
			let:isFocused
			let:isHovered
		>
			<div
				slot="icon"
				bind:this={div}
				class="icon"
				style="
					--colour-svg: {CssUtility.parse(isHovered ? hoverSvgColour : svgColour)};
				"
			/>
			<slot {isHovered} {isDisabled} {isAnimated} {isFocused} />
		</Button>
	{:else}
		<div
			bind:this={div}
			class="icon"
			style="
				--colour-svg: {CssUtility.parse(svgColour)};
			"
		/>
	{/if}
</div>

<style>
	.component {
		display: contents;
	}

	.icon {
		display: contents;

		fill: var(--colour-svg);

		transition: fill 0.2s var(--ease-slow-slow);
	}
</style>
