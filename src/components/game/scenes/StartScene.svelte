<script lang="ts">
	import SvgButton from '../../composable/buttons/SvgButton.svelte';
	import { arrow_forward } from '!i/twotone::arrow_forward';
	import type { Game } from '../../../core/game/Game';

	export let game: Game;
</script>

<div type="StartScene" class="component">
	<h1>Anti Game-studies Game-studies Game</h1>
	<SvgButton
		svg={arrow_forward}
		on:click={() => {
			game.start();
		}}>start!</SvgButton
	>
</div>

<style lang="postcss">
	.component {
		@apply grid
			gap-8
			place-items-center;

		padding: theme('padding');

		& > h1 {
			@apply text-center;
		}
	}
</style>
