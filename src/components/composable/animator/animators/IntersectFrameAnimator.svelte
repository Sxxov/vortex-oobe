<script lang="ts">
	import { Animator } from '../../../../core/animator';
	import AnimatorComponent from '../Animator.svelte';
	import { IntersectFrameController } from '../../../../core/animator/controllers/IntersectFrameController';
	import type { PlayDirection } from '../../.../../../../core/animator/controllers/FrameController';

	export let animator = new Animator();
	export let delay: number | undefined = undefined;
	export let direction: PlayDirection | undefined = undefined;

	const controller = (elem: HTMLElement) =>
		new IntersectFrameController(animator, elem, delay, direction);
</script>

<AnimatorComponent
	{animator}
	{controller}
	let:container
	let:controller={resolvedController}
>
	<slot {animator} {container} controller={resolvedController} />
</AnimatorComponent>
