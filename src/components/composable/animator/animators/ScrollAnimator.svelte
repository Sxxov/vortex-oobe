<script lang="ts">
	import { Animator } from '../../../../core/animator';
	import AnimatorComponent from '../Animator.svelte';
	import {
		ScrollAxis,
		ScrollController,
	} from '../../../../core/animator/controllers/ScrollController';

	export let animator = new Animator();
	export let framesPerViewport: number | undefined = undefined;
	export let axis: ScrollAxis | undefined = undefined;

	const controller = new ScrollController(animator, framesPerViewport, axis);
</script>

<AnimatorComponent
	{animator}
	{controller}
	let:container
	let:controller={resolvedController}
>
	<slot {animator} {container} controller={resolvedController} />
</AnimatorComponent>
