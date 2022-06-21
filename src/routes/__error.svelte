<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const prerender = true;
	export const load: Load = ({ error, status }) => ({
		props: {
			status,
			error,
		},
	});
</script>

<script lang="ts">
	export let error: Parameters<Load>[0]['error'];
	export let status: Parameters<Load>[0]['status'];
</script>

<div type="/__error" class="component">
	<div class="content">
		<h1>{status}</h1>
		{#if error}
			<p>{error.message}</p>
		{/if}
	</div>
</div>

<style>
	.component {
		padding: 20vw;
		box-sizing: border-box;
		display: grid;
		height: 100%;
		justify-items: center;
		align-items: center;
	}

	.content {
		text-align: center;
	}

	h1 {
		font-size: 4rem;
		line-height: 2;
	}
</style>
