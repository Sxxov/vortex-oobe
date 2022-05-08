<script lang="ts">
	import GameRenderer from '../components/game/GameRenderer.svelte';
</script>

<div type="/index" class="component">
	<GameRenderer />
</div>

<style lang="postcss">
	.component {
		padding: 0;
		box-sizing: border-box;
		display: grid;
		height: 100vh;
		justify-items: center;
		align-items: center;
	}
</style>
