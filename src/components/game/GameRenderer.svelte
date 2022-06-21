<script context="module" lang="ts">
	export let game: Game;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { Store } from '../../core/blocks/store';
	import { Game } from '../../core/game/Game';
	import { ScreenSpace } from '../../core/game/screen/ScreenSpace';

	let boundingBoxW: Store<DOMRect>;

	let windowHeight: number;
	let gameHeight: number;
	let gameWidth: number;

	let hasMounted = false;
	let gameDiv: HTMLDivElement;

	$: {
		gameWidth;
		gameHeight;
		onResize();
	}

	onMount(() => {
		boundingBoxW = new Store(new DOMRect());
		game ??= new Game(new ScreenSpace(boundingBoxW));

		requestAnimationFrame(onResize);

		hasMounted = true;
	});

	function onResize() {
		if (gameDiv) {
			boundingBoxW?.set(gameDiv.getBoundingClientRect());
		}
	}
</script>

<svelte:window on:resize={onResize} bind:innerHeight={windowHeight} />

{#if hasMounted}
	<div
		type="GameRenderer"
		class="component"
		style="--height-window: {windowHeight}px"
	>
		<div
			bind:this={gameDiv}
			bind:clientHeight={gameHeight}
			bind:clientWidth={gameWidth}
		>
			<slot {game} />
		</div>
	</div>
{/if}

<style lang="postcss">
	.component {
		@apply grid
			place-items-center;

		height: var(--height-window);
	}
</style>
