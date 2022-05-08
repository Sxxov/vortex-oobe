<script lang="ts">
	import SvgButton from '../composable/buttons/SvgButton.svelte';
	import type { Css } from '../../resources/utilities';
	import logo from '../../assets/img/logo.svg';
	import { arrow_back } from '!i/twotone::arrow_back';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let colour: Css = '--colour-text-primary';
	export let hoverBackgroundColour: Css = '#fff1';
	export let backgroundColour: Css = 'transparent';
</script>

<div type="<Logo>" class="component">
	<SvgButton
		on:click={() => {
			void goto('/');

			window.scrollTo({
				top: 0,
				left: 0,
				behavior: 'smooth',
			});
		}}
		svg={logo}
		svgColour={colour}
		{backgroundColour}
		{hoverBackgroundColour}
		{...$$restProps}
	/>
	{#if $page.url.pathname !== '/'}
		<SvgButton
			on:click={() => {
				history.back();
			}}
			svg={arrow_back}
			svgColour={colour}
			{backgroundColour}
			{hoverBackgroundColour}
			{...$$restProps}
		/>
	{/if}
</div>

<style lang="postcss">
	.component {
		@apply h-auto
			w-auto
			flex;
	}
</style>
