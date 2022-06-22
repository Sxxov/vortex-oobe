<script lang="ts">
	import UiRenderer from '../renderers/UiRenderer.svelte';
	import { fade } from '../../../core/transitioner';
	import EntityRenderer from '../renderers/EntityRenderer.svelte';
	import type { Game } from '../../../core/game/Game';
	import { GameConstants } from '../../../core/game/GameConstants';

	export let game: Game;

	const { uiQueue: uiQueueW, round: roundW } = game;

	let [ih, iw, oh, ow] = [0, 0, 0, 0];

	$: ({ entityPool: entityPoolW } = $roundW!);

	// sometimes inner* will glitch on chrome mobile, being wider than outer*
	// get the smaller amongst them
	$: [h, w] = [Math.min(ih, oh), Math.min(iw, ow)];
</script>

<svelte:window
	bind:innerHeight={ih}
	bind:innerWidth={iw}
	bind:outerHeight={oh}
	bind:outerWidth={ow}
/>

<div
	type="ClassScene"
	class="component"
	in:fade={{ duration: 1000 }}
	style="
		--height: {w > h
		? h
		: GameConstants.GRID_ROW_COUNT *
		  (w / GameConstants.GRID_COLUMN_COUNT)}px;
		--width: {w > h
		? GameConstants.GRID_COLUMN_COUNT * (h / GameConstants.GRID_ROW_COUNT)
		: w}px;
	"
>
	{#if $uiQueueW[0]}
		<UiRenderer
			ui={$uiQueueW[0]}
			{game}
			on:result={() => {
				uiQueueW.shift();
			}}
		/>
	{/if}
	{#each $entityPoolW as entity}
		<EntityRenderer {entity} {game} />
	{/each}
</div>

<style lang="postcss">
	.component {
		height: var(--height);
		width: var(--width);
	}
</style>
