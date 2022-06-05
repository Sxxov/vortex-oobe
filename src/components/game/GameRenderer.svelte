<script lang="ts">
	import { onMount } from 'svelte';
	import { Store } from '../../core/blocks/store';
	import type { ArrayStore } from '../../core/blocks/store/stores/ArrayStore';
	import { ConsumableComponent } from '../../core/game/components/consumable/ConsumableComponent';
	import { DreamComponent } from '../../core/game/components/dream/DreamComponent';
	import type { TDream } from '../../core/game/components/dream/TDream';
	import type { TUi } from '../../core/game/components/ui/TUi';
	import type { AbstractEntity } from '../../core/game/entities/AbstractEntity';
	import { Game } from '../../core/game/Game';
	import type { Round } from '../../core/game/round/Round';
	import { ScreenSpace } from '../../core/game/screen/ScreenSpace';
	import DreamRenderer from './DreamRenderer.svelte';
	import EntityRenderer from './EntityRenderer.svelte';
	import UiRenderer from './UiRenderer.svelte';

	let screenSpace: ScreenSpace;
	let game: Game;

	let roundW: Store<Round>;
	let entityPoolW: ArrayStore<AbstractEntity>;
	let boundingBoxW: Store<DOMRect>;
	let uiQueueW: ArrayStore<TUi>;
	let isDreamingW: Store<boolean>;

	let gameHeight: number;
	let gameWidth: number;

	let hasMounted = false;
	let gameDiv: HTMLDivElement;

	let dreamUis: TDream[];

	$: {
		gameWidth;
		gameHeight;
		onResize();
	}

	$: if ($roundW) {
		({ entityPool: entityPoolW, isDreaming: isDreamingW } = $roundW);
	}

	$: if ($entityPoolW) {
		dreamUis = $entityPoolW
			.map(
				(entity) =>
					entity.component(ConsumableComponent)?.isConsumed.value &&
					entity.component(DreamComponent)?.ui,
			)
			.filter(Boolean) as TDream[];
	}

	onMount(() => {
		boundingBoxW = new Store(new DOMRect());
		screenSpace = new ScreenSpace(boundingBoxW);
		game = new Game(screenSpace);

		({ round: roundW, uiQueue: uiQueueW } = game);

		hasMounted = true;

		requestAnimationFrame(onResize);
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
	class:dreaming={$isDreamingW}
	bind:this={gameDiv}
	bind:clientHeight={gameHeight}
	bind:clientWidth={gameWidth}
>
	{#if hasMounted}
		{#if $isDreamingW}
			<DreamRenderer
				{game}
				uis={dreamUis}
				on:wake={() => {
					game.proceedToNextRound();
					console.log('wake');
				}}
			/>
		{:else}
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
	{/if}
</div>

<style lang="postcss">
	.game {
		height: 100vmin;
		width: 100vmin;

		&.dreaming {
			height: 100vh;
			width: 100vw;
		}
	}
</style>
