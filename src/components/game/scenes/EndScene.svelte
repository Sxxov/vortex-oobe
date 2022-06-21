<script lang="ts">
	import DreamRenderer from '../renderers/DreamRenderer.svelte';
	import type { Game } from '../../../core/game/Game';
	import { GameStates } from '../../../core/game/GameStates';
	import type { IDreamContext } from '../renderers/dream/IDreamContext';
	import type { SvelteComponentTyped } from 'svelte';
	import PedophilicEndContent from '../renderers/dream/PedophilicEndContent.svelte';

	export let game: Game;

	let ContentComponent: new (...args: any[]) => SvelteComponentTyped<{
		game: Game;
		ctx: IDreamContext;
	}>;

	switch (game.state.value) {
		case GameStates.POSTGAME_PEDOPHILIC:
			ContentComponent = PedophilicEndContent;
			break;
		case GameStates.POSTGAME_HOMICIDAL:
		case GameStates.POSTGAME_SUICIDAL:
		default:
	}
</script>

<div type="EndScene" class="component">
	<DreamRenderer let:ctx>
		<svelte:component this={ContentComponent} {ctx} {game} />
	</DreamRenderer>
</div>

<style lang="postcss">
	.component {
		@apply w-screen;

		height: var(--height-window);
	}
</style>
