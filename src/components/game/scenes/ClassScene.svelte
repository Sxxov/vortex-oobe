<script lang="ts">
	import UiRenderer from '../renderers/UiRenderer.svelte';
	import { fade } from '../../../core/transitioner';
	import EntityRenderer from '../renderers/EntityRenderer.svelte';
	import type { Game } from '../../../core/game/Game';

	export let game: Game;

	const { uiQueue: uiQueueW, round: roundW } = game;

	$: ({ entityPool: entityPoolW } = $roundW!);
</script>

<div type="ClassScene" class="component" in:fade={{ duration: 1000 }}>
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
		height: 100vmin;
		width: 100vmin;
	}
</style>
