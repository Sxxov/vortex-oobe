<script lang="ts">
	import GameRenderer from '../components/game/GameRenderer.svelte';

	let innerHeight: number;
</script>

<svelte:window bind:innerHeight />

<div type="/index" class="component" style="--height: {innerHeight}px">
	<GameRenderer />
</div>

<style lang="postcss">
	:global(body) {
		overscroll-behavior-y: contain;
	}

	.component {
		padding: 0;
		box-sizing: border-box;
		display: grid;
		height: var(--height);
		justify-items: center;
		align-items: center;
	}
</style>
