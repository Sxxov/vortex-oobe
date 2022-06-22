<script lang="ts">
	import DreamRenderer from '../renderers/DreamRenderer.svelte';
	import DreamUiContent from '../renderers/dream/DreamUiContent.svelte';
	import type { Game } from '../../../core/game/Game';

	export let game: Game;
</script>

<div type="DreamScene" class="component">
	<DreamRenderer
		on:wake={() => {
			game.round.forward();
		}}
		let:ctx
	>
		<DreamUiContent {ctx} {game} />
	</DreamRenderer>
</div>

<style lang="postcss">
	.component {
		@apply w-screen;

		height: var(--height-window);
	}
</style>
