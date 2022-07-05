<script lang="ts">
	import SvgButton from '../../composable/buttons/SvgButton.svelte';
	import { arrow_forward } from '!i/twotone::arrow_forward';
	import type { Game } from '../../../core/game/Game';

	export let game: Game;

	// remove warning about unused props
	game;
</script>

<div type="FailScene" class="component">
	<h1>You've failed Game Studies</h1>
	<p>Honestly that's impressive feat in its own right</p>
	<SvgButton
		svg={arrow_forward}
		on:click={() => {
			location.href = '/';
		}}>shame, try again</SvgButton
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
