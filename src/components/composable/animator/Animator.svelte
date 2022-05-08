<script lang="ts" context="module">
	export type TFactoryOrValue<T, Args extends any[]> =
		| ((...args: Args) => T)
		| ((...args: Args) => Promise<T>)
		| T;
	export type TControllerFactoryOrValue = TFactoryOrValue<
		AbstractController,
		[elem: HTMLElement]
	>;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import type { Animator } from '../../../core/animator';
	import type { AbstractController } from '../../../core/animator/controllers/AbstractController';

	export let animator: Animator;
	export let controller: TControllerFactoryOrValue;

	let resolvedController: AbstractController;

	/** @export */
	export let container: HTMLDivElement | undefined = undefined;

	onMount(async () => {
		if (typeof controller === 'function') {
			resolvedController = await controller(container!);
		} else {
			resolvedController = controller;
		}
	});
</script>

<div type="<Animator>" class="component" bind:this={container}>
	<slot {animator} {container} controller={resolvedController} />
</div>

<style>
	.component {
		display: contents;
	}
</style>
