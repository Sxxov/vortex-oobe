<script lang="ts">
	import Content from '../components/Content.svelte';
	import DreamRenderer from '../components/game/renderers/DreamRenderer.svelte';
</script>

<div type="/index" class="component">
	<DreamRenderer enforceLuminance={false} let:ctx>
		<Content {ctx} />
	</DreamRenderer>
</div>

<style lang="postcss">
</style>
