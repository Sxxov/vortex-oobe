<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '../Button.svelte';
	import Lottie from '../Lottie.svelte';
	import type { Css } from '../../../resources/utilities';
	import type { AnimationItem } from 'lottie-web';
	import type { Readable } from 'svelte/store';

	export let isActive = false;

	export let src = '';
	export let animationData: Record<any, any> = {};
	export let hoverBackgroundColour: Css = '#fff1';
	export let backgroundColour: Css = '#0000';
	export let height: Css = '100%';
	export let width: Css = '100%';
	export let overrideColour: Css = '';
	export let padding: Css = '16px 16px';

	let animationR: Readable<AnimationItem>;

	$: if ($animationR?.playDirection) {
		isActive = -$animationR.playDirection > 0;
	}

	$: $animationR?.setDirection(isActive ? 1 : -1), $animationR?.play();

	const dispatch = createEventDispatcher();
</script>

<div type="<LottieToggleButton>" class="component">
	<Button
		{...$$restProps}
		isSlotHooksEnabled={false}
		{height}
		{width}
		{backgroundColour}
		{hoverBackgroundColour}
		isText={false}
		{padding}
		roundness="--roundness"
		on:click={() => {
			isActive = !isActive;

			dispatch('click', isActive);
		}}
	>
		<Lottie
			{src}
			{animationData}
			{overrideColour}
			options={{
				autoplay: false,
				loop: false,
			}}
			bind:animationR
		/>
	</Button>
</div>
