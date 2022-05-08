<script lang="ts">
	import { onMount } from 'svelte';
	import { Store } from '../../core/blocks/store';
	import type { ArrayStore } from '../../core/blocks/store/stores/ArrayStore';
	import type { TUi } from '../../core/game/components/ui/TUi';
	import type { AbstractEntity } from '../../core/game/entities/AbstractEntity';
	import { Game } from '../../core/game/Game';
	import type { Round } from '../../core/game/round/Round';
	import { ScreenSpace } from '../../core/game/screen/ScreenSpace';
	import EntityRenderer from './EntityRenderer.svelte';
	import UiRenderer from './UiRenderer.svelte';

	let screenSpace: ScreenSpace;
	let game: Game;

	let roundW: Store<Round>;
	let entityPoolW: ArrayStore<AbstractEntity>;
	let boundingBoxW: Store<DOMRect>;
	let uiQueueW: ArrayStore<TUi>;

	let gameHeight: number;
	let gameWidth: number;

	let hasMounted = false;
	let gameDiv: HTMLDivElement;

	$: {
		gameWidth;
		gameHeight;
		onResize();
	}

	$: if ($roundW) {
		({ entityPool: entityPoolW } = $roundW);
	}

	onMount(() => {
		boundingBoxW = new Store(new DOMRect());
		screenSpace = new ScreenSpace(boundingBoxW);
		game = new Game(screenSpace);

		({ round: roundW, uiQueue: uiQueueW } = game);

		hasMounted = true;
	});

	function onResize() {
		if (gameDiv) {
			boundingBoxW?.set(gameDiv.getBoundingClientRect());
		}
	}
</script>

<svelte:window on:resize={onResize} />

<div
	class="game"
	bind:this={gameDiv}
	bind:clientHeight={gameHeight}
	bind:clientWidth={gameWidth}
>
	{#if hasMounted}
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
	{/if}
</div>

<style lang="postcss">
	.game {
		height: 100vmin;
		width: 100vmin;
	}
</style>
