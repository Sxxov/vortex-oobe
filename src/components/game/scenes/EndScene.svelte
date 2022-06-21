<script lang="ts">
	import DreamRenderer from '../renderers/DreamRenderer.svelte';
	import DreamUiContent from '../renderers/dream/DreamUiContent.svelte';
	import type { Game } from '../../../core/game/Game';

	export let game: Game;
</script>

<div type="EndScene" class="component">
	<DreamRenderer let:ctx>
		<DreamUiContent {ctx} {game} />
	</DreamRenderer>
</div>

<style lang="postcss">
	.component {
		height: 100vh;
		width: 100vw;
	}
</style>
