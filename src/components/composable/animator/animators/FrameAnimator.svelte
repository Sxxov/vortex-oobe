<script lang="ts">
	import { Animator } from '../../../../core/animator';
	import AnimatorComponent from '../Animator.svelte';
	import { FrameController } from '../../../../core/animator/controllers/FrameController';

	export let animator = new Animator();

	const controller = new FrameController(animator);
</script>

<AnimatorComponent
	{animator}
	{controller}
	let:container
	let:controller={resolvedController}
>
	<slot
		{animator}
		{container}
		controller={resolvedController}
		play={controller.play.bind(controller)}
		pause={controller.pause.bind(controller)}
		seek={controller.seek.bind(controller)}
		loop={controller.loop.bind(controller)}
		isPausedR={controller.isPausedR}
	/>
</AnimatorComponent>
