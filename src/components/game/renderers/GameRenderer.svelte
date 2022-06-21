<script lang="ts">
	import { onMount } from 'svelte';
	import type { SvelteComponentTyped } from 'svelte/internal';
	import { Store } from '../../../core/blocks/store';
	import { Game } from '../../../core/game/Game';
	import { GameStates } from '../../../core/game/GameStates';
	import type { Round } from '../../../core/game/round/Round';
	import { RoundStates } from '../../../core/game/round/RoundStates';
	import { ScreenSpace } from '../../../core/game/screen/ScreenSpace';
	import { IllegalStateError } from '../../../resources/errors';
	import ClassScene from '../scenes/ClassScene.svelte';
	import DreamScene from '../scenes/DreamScene.svelte';
	import EndScene from '../scenes/EndScene.svelte';
	import StartScene from '../scenes/StartScene.svelte';

	let boundingBoxW: Store<DOMRect>;

	let windowHeight: number;
	let gameHeight: number;
	let gameWidth: number;

	let hasMounted = false;
	let gameDiv: HTMLDivElement;

	let game: Game;
	let gameStateW: Store<GameStates>;
	let roundW: Store<Round | undefined>;
	let roundStateW: Store<RoundStates>;
	let SceneComponent: new (...args: any[]) => SvelteComponentTyped<{
		game: Game;
	}>;

	onMount(() => {
		boundingBoxW = new Store(new DOMRect());
		game ??= new Game(new ScreenSpace(boundingBoxW));
		({ state: gameStateW, round: roundW } = game);

		requestAnimationFrame(onResize);

		hasMounted = true;
	});

	$: gameWidth, gameHeight, onResize();

	$: if ($roundW) {
		roundStateW = $roundW.state;
	}

	$: if (hasMounted) {
		switch ($gameStateW) {
			case GameStates.PREGAME:
				SceneComponent = StartScene;
				break;
			case GameStates.GAME:
				switch ($roundStateW) {
					case RoundStates.IN_CLASS:
						SceneComponent = ClassScene;
						break;
					case RoundStates.IN_DREAM:
						SceneComponent = DreamScene;
						break;
					case RoundStates.FINISHED:
					default:
				}

				break;
			case GameStates.POSTGAME:
				SceneComponent = EndScene;
				break;
			default:
				throw new IllegalStateError(
					`Attempted to render unknown game state(${String(
						$gameStateW,
					)})`,
				);
		}
	}

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
			<svelte:component this={SceneComponent} {game} />
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
